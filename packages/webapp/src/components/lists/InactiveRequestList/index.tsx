/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useState } from 'react'
import { useWindowSize } from '~hooks/useWindowSize'
import type { StandardFC } from '~types/StandardFC'
import type { Engagement } from '@cbosuite/schema/dist/client-types'
import { PaginatedList } from '~components/ui/PaginatedList'
import cx from 'classnames'
import styles from './index.module.scss'
import { wrap } from '~utils/appinsights'
import { usePageColumns, useMobileColumns } from './columns'
import { useEngagementSearchHandler } from '~hooks/useEngagementSearchHandler'

interface InactiveRequestListProps {
	title: string
	requests?: Engagement[]
	loading?: boolean
	onPageChange?: (items: Engagement[], currentPage: number) => void
}

export const InactiveRequestList: StandardFC<InactiveRequestListProps> = wrap(
	function InactiveRequestList({ title, requests, loading, onPageChange }) {
		const { isMD } = useWindowSize()
		const [filteredList, setFilteredList] = useState<Engagement[]>(requests)
		const searchList = useEngagementSearchHandler(requests, setFilteredList)
		const pageColumns = usePageColumns()
		const mobileColumns = useMobileColumns()
		return (
			<div className={cx('mt-5 mb-5', styles.requestList, 'inactiveRequestList')}>
				<PaginatedList
					title={title}
					list={filteredList}
					itemsPerPage={isMD ? 10 : 5}
					columns={isMD ? pageColumns : mobileColumns}
					hideListHeaders={!isMD}
					rowClassName={isMD ? 'align-items-center' : undefined}
					onSearchValueChange={searchList}
					onPageChange={onPageChange}
					isLoading={loading}
					isMD={isMD}
					collapsible
					collapsibleStateName='isInactiveRequestsListOpen'
				/>
			</div>
		)
	}
)
