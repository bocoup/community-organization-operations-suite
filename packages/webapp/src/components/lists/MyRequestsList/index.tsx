/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useBoolean } from '@fluentui/react-hooks'
import { useEffect, useMemo, useState } from 'react'
import cx from 'classnames'
import styles from './index.module.scss'
import { EditRequestForm } from '~forms/EditRequestForm'
import { Panel } from '~ui/Panel'
import { PaginatedList } from '~components/ui/PaginatedList'

// Types
import type { Engagement, EngagementInput } from '@cbosuite/schema/dist/client-types'
import type { IMultiActionButtons } from '~ui/MultiActionButton2'
import type { StandardFC } from '~types/StandardFC'

// Utils
import { wrap } from '~utils/appinsights'
import { sortByDuration, sortByIsLocal } from '~utils/engagements'

// Hooks
import { useEngagementList } from '~hooks/api/useEngagementList'
import { useMobileColumns, usePageColumns } from './columns'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { useEngagementSearchHandler } from '~hooks/useEngagementSearchHandler'
import { useWindowSize } from '~hooks/useWindowSize'

// Apollo
import { GET_USER_ACTIVES_ENGAGEMENTS, SUBSCRIBE_TO_ORG_ENGAGEMENTS } from '~queries'
import { useQuery } from '@apollo/client'

// Logs
import { createLogger } from '~utils/createLogger'
const logger = createLogger('useEngagementList')

export const MyRequestsList: StandardFC = wrap(function MyRequestsList() {
	const { c, t } = useTranslation(Namespace.Requests)
	const { isMD } = useWindowSize()
	const { userId, orgId } = useCurrentUser()
	const { editEngagement } = useEngagementList(orgId, userId)

	// Fetch the data
	const { data, loading, subscribeToMore } = useQuery(GET_USER_ACTIVES_ENGAGEMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { orgId: orgId, userId: userId },
		onError: (error) => logger(c('hooks.useEngagementList.loadDataFailed'), error)
	})

	// Update the Query cached results with the subscription
	// https://www.apollographql.com/docs/react/data/subscriptions#subscribing-to-updates-for-a-query
	useEffect(() => {
		subscribeToMore({
			document: SUBSCRIBE_TO_ORG_ENGAGEMENTS,
			variables: { orgId: orgId },
			updateQuery: (previous, { subscriptionData }) => {
				if (!subscriptionData || !subscriptionData?.data?.engagements) {
					return previous
				}

				const { action, engagement, message } = subscriptionData.data.engagements
				if (message !== 'Success') return previous

				// Setup the engagements to replace in the cache
				let userActiveEngagements = [...previous.userActiveEngagements]

				// If it's a CLOSED or COMPLETED, we remove it
				if (['CLOSED', 'COMPLETED'].includes(action)) {
					userActiveEngagements = userActiveEngagements.filter((e) => e.id !== engagement.id)
				}

				// If it's a new or existing engagement from the currentUser, we update it
				if (['UPDATE', 'CREATED'].includes(action)) {
					userActiveEngagements = userActiveEngagements.filter((e) => e.id !== engagement.id)
					if (engagement?.user?.id === userId) {
						userActiveEngagements = [...userActiveEngagements, engagement]
					}
				}

				return { activeEngagements: previous.activeEngagements, userActiveEngagements }
			}
		})
	}, [orgId, userId, subscribeToMore])

	// Memoized the Engagements to only update when useQuery is triggered
	const engagements: Engagement[] = useMemo(
		() => [...(data?.userActiveEngagements ?? [])]?.sort(sortByDuration)?.sort(sortByIsLocal),
		[data]
	)

	const [isEditFormOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false)
	const [filteredList, setFilteredList] = useState<Engagement[]>([])
	const [engagement, setSelectedEngagement] = useState<Engagement | undefined>()
	const searchList = useEngagementSearchHandler(engagements, setFilteredList)

	// Update the filteredList when useQuery triggers.
	// TODO: This is an ugly hack based on the fact that the search is handle here,
	// but triggered by a child component. PaginatedList component needs to be fixed.
	useEffect(() => {
		if (data && data.userActiveEngagements) {
			const searchField = document.querySelector(
				'.myRequestList input[type=text]'
			) as HTMLInputElement
			searchList(searchField?.value ?? '')
		}
	}, [data, searchList])

	const handleEdit = (values: EngagementInput) => {
		dismissPanel()
		editEngagement(values)
	}

	const columnActionButtons: IMultiActionButtons<Engagement>[] = [
		{
			name: t('requestListRowActions.edit'),
			className: cx(styles.editButton),
			onActionClick(engagement: Engagement) {
				setSelectedEngagement(engagement)
				openPanel()
			}
		}
	]

	const pageColumns = usePageColumns(columnActionButtons)
	const mobileColumns = useMobileColumns(columnActionButtons)

	const rowClassName = isMD ? 'align-items-center' : undefined

	return (
		<>
			<div className='mt-5 mb-5 myRequestList'>
				<PaginatedList
					title={t('myRequestsTitle')}
					list={filteredList}
					itemsPerPage={isMD ? 10 : 5}
					columns={isMD ? pageColumns : mobileColumns}
					hideListHeaders={!isMD}
					rowClassName={rowClassName}
					onSearchValueChange={searchList}
					isLoading={loading}
					isMD={isMD}
					collapsible
					collapsibleStateName='isMyRequestsListOpen'
				/>
			</div>
			<Panel openPanel={isEditFormOpen} onDismiss={dismissPanel}>
				<EditRequestForm
					title={t('requestEditButton')}
					engagement={engagement}
					onSubmit={handleEdit}
				/>
			</Panel>
		</>
	)
})
