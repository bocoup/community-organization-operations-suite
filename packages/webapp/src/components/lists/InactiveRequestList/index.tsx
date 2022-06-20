/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect, useState } from 'react'
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

type RequestsListProps = {
	engagements: Engagement[]
	loading: boolean
}

export const InactiveRequestList: StandardFC<RequestsListProps> = wrap(
	function InactiveRequestList({ engagements, loading }) {
		const { t } = useTranslation(Namespace.Requests)
		const { isMD } = useWindowSize()

		const [filteredList, setFilteredList] = useState<Engagement[]>(engagements)
		const searchList = useEngagementSearchHandler(engagements, setFilteredList)

		// Update the filteredList when useQuery triggers.
		// TODO: This is an ugly hack based on the fact that the search is handle here,
		// but triggered by a child component. PaginatedList component needs to be fixed.
		useEffect(() => {
			if (engagements) {
				const searchField = document.querySelector(
					'.inactiveRequestList input[type=text]'
				) as HTMLInputElement
				searchList(searchField?.value ?? '')
			}
		}, [engagements, searchList])

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
					isLoading={loading && filteredList.length === 0}
					isMD={isMD}
					collapsible
					collapsibleStateName='isInactiveRequestsListOpen'
				/>
			</div>
		)
	}
)
