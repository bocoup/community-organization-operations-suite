/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useWindowSize } from '~hooks/useWindowSize'
import type { StandardFC } from '~types/StandardFC'
import type { Engagement } from '@cbosuite/schema/dist/client-types'
import { PaginatedList } from '~components/ui/PaginatedList'
import cx from 'classnames'
import styles from './index.module.scss'
import { wrap } from '~utils/appinsights'
import { usePageColumns, useMobileColumns } from './columns'
import { useEngagementSearchHandler } from '~hooks/useEngagementSearchHandler'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { sortByDate } from '~utils/sorting'
import { createLogger } from '~utils/createLogger'
import { GET_INACTIVE_ENGAGEMENTS, SUBSCRIBE_TO_ORG_ENGAGEMENTS } from '~queries'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
const logger = createLogger('useInativeEngagementList')

function sortInactive(a: Engagement, b: Engagement) {
	return sortByDate({ date: a.startDate }, { date: b.startDate })
}

export const InactiveRequestList: StandardFC = wrap(function InactiveRequestList() {
	const { c, t } = useTranslation(Namespace.Requests)
	const { isMD } = useWindowSize()
	const { orgId } = useCurrentUser()

	// Engagements query
	const { data, loading, subscribeToMore } = useQuery(GET_INACTIVE_ENGAGEMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { orgId: orgId },
		onError: (error) => logger(c('hooks.useInactiveEngagementList.loadDataFailed'), error)
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

				// Only add CLOSED or COMPLETED engagement to the inactive
				if (message !== 'Success' || !['CLOSED', 'COMPLETED'].includes(action)) {
					return previous
				}

				// Add the new inactive engagement to the list
				return { inactiveEngagements: [...previous.inactiveEngagements, engagement] }
			}
		})
	}, [orgId, subscribeToMore])

	// Memoized the Engagements to only update when useQuery is triggered
	const engagements = useMemo(
		() => [...(data?.inactiveEngagements ?? [])].sort(sortInactive),
		[data]
	)

	const [filteredList, setFilteredList] = useState<Engagement[]>(engagements)
	const searchList = useEngagementSearchHandler(engagements, setFilteredList)

	// Update the filteredList when useQuery triggers.
	// TODO: This is an ugly hack based on the fact that the search is handle here,
	// but triggered by a child component. PaginatedList component needs to be fixed.
	useEffect(() => {
		if (data && data.inactiveEngagements) {
			const searchField = document.querySelector(
				'.inactiveRequestList input[type=text]'
			) as HTMLInputElement
			searchList(searchField?.value ?? '')
		}
	}, [data, searchList])

	const pageColumns = usePageColumns()
	const mobileColumns = useMobileColumns()

	return (
		<div className={cx('mt-5 mb-5', styles.requestList, 'inactiveRequestList')}>
			<PaginatedList
				title={t('closedRequestsTitle')}
				list={filteredList}
				itemsPerPage={isMD ? 10 : 5}
				columns={isMD ? pageColumns : mobileColumns}
				hideListHeaders={!isMD}
				rowClassName={isMD ? 'align-items-center' : undefined}
				onSearchValueChange={searchList}
				isLoading={loading}
				isMD={isMD}
				collapsible
				collapsibleStateName='isInactiveRequestsListOpen'
			/>
		</div>
	)
})
