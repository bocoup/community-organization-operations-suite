/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useBoolean } from '@fluentui/react-hooks'
import { useEffect, useMemo, useState } from 'react'
import { EditRequestForm } from '~forms/EditRequestForm'
import { Panel } from '~ui/Panel'
import type { StandardFC } from '~types/StandardFC'
import type { Engagement, EngagementInput } from '@cbosuite/schema/dist/client-types'
import { PaginatedList } from '~components/ui/PaginatedList'
import cx from 'classnames'
import styles from './index.module.scss'

// Utils
import { wrap } from '~utils/appinsights'
import { sortByDuration, sortByIsLocal } from '~utils/engagements'

// Hooks
import { useMobileColumns, usePageColumns } from './columns'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useEngagementList } from '~hooks/api/useEngagementList'
import { useEngagementSearchHandler } from '~hooks/useEngagementSearchHandler'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { useWindowSize } from '~hooks/useWindowSize'

// Apollo
import { GET_USER_ACTIVES_ENGAGEMENTS, SUBSCRIBE_TO_ORG_ENGAGEMENTS } from '~queries'
import { useQuery } from '@apollo/client'

// Logs
import { createLogger } from '~utils/createLogger'
const logger = createLogger('useEngagementList')

export const RequestList: StandardFC = wrap(function RequestList() {
	const { c, t } = useTranslation(Namespace.Requests)
	const { isMD } = useWindowSize()
	const { userId, orgId } = useCurrentUser()
	const { editEngagement, claimEngagement } = useEngagementList(orgId, userId)

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
				let activeEngagements = [...previous.activeEngagements]

				// If it's a new engagement, but not from the currentUser, we add it
				if (action === 'CREATED' && engagement?.user?.id !== userId) {
					activeEngagements = [...activeEngagements, engagement]
				}

				// If it's a CLOSED or COMPLETED, we remove it
				if (['CLOSED', 'COMPLETED'].includes(action)) {
					activeEngagements = activeEngagements.filter((e) => e.id !== engagement.id)
				}

				// If it's an exisiting engagement, but not from the currentUser, we update it
				if (action === 'UPDATE' && engagement?.user?.id !== userId) {
					activeEngagements = activeEngagements.filter((e) => e.id !== engagement.id)
					activeEngagements = [...activeEngagements, engagement]
				}

				return { activeEngagements, userActiveEngagements: previous.userActiveEngagements }
			}
		})
	}, [orgId, userId, subscribeToMore])

	// Memoized the Engagements to only update when useQuery is triggered
	const engagements: Engagement[] = useMemo(
		() => [...(data?.activeEngagements ?? [])]?.sort(sortByDuration)?.sort(sortByIsLocal),
		[data]
	)

	const [filteredList, setFilteredList] = useState<Engagement[]>(engagements)
	const [isEditFormOpen, { setTrue: openEditRequestPanel, setFalse: dismissEditRequestPanel }] =
		useBoolean(false)
	const [selectedEngagement, setSelectedEngagement] = useState<Engagement | undefined>()
	const searchList = useEngagementSearchHandler(engagements, setFilteredList)

	// Update the filteredList when useQuery triggers.
	// TODO: This is an ugly hack based on the fact that the search is handle here,
	// but triggered by a child component. PaginatedList component needs to be fixed.
	useEffect(() => {
		if (data && data.activeEngagements) {
			const searchField = document.querySelector(
				'.requestList input[type=text]'
			) as HTMLInputElement
			searchList(searchField?.value ?? '')
		}
	}, [data, searchList])

	const handleEdit = (values: EngagementInput) => {
		dismissEditRequestPanel()
		editEngagement(values)
	}

	const handleOnEdit = (engagement: Engagement) => {
		setSelectedEngagement(engagement)
		openEditRequestPanel()
	}

	const pageColumns = usePageColumns((form: any) => claimEngagement(form.id, userId), handleOnEdit)
	const mobileColumn = useMobileColumns(
		(form: any) => claimEngagement(form.id, userId),
		handleOnEdit
	)

	const rowClassName = isMD ? 'align-items-center' : undefined

	return (
		<>
			<div className={cx('mt-5 mb-5', styles.requestList, 'requestList')}>
				<PaginatedList
					title={t('requestsTitle')}
					list={filteredList}
					itemsPerPage={isMD ? 10 : 5}
					columns={isMD ? pageColumns : mobileColumn}
					hideListHeaders={!isMD}
					rowClassName={rowClassName}
					onSearchValueChange={searchList}
					isLoading={loading}
					isMD={isMD}
					collapsible
					collapsibleStateName='isRequestsListOpen'
				/>
			</div>
			<Panel openPanel={isEditFormOpen} onDismiss={dismissEditRequestPanel}>
				<EditRequestForm
					title={t('requestEditButton')}
					engagement={selectedEngagement}
					onSubmit={handleEdit}
				/>
			</Panel>
		</>
	)
})
