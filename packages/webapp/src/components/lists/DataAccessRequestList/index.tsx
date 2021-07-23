/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useEffect, useState } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import ClientOnly from '~ui/ClientOnly'
import cx from 'classnames'
import { Delegate } from '@resolve/schema/lib/client-types'
import MultiActionButton, { IMultiActionButtons } from '~ui/MultiActionButton2'

interface DataAccessRequestListProps extends ComponentProps {
	title?: string
	delegates?: Delegate[]
	loading?: boolean
}

const DataAccessRequestList = memo(function DataAccessRequestList({
	title,
	delegates,
	loading
}: DataAccessRequestListProps): JSX.Element {
	const [filteredList, setFilteredList] = useState<Delegate[]>(delegates)

	useEffect(() => {
		if (delegates) {
			setFilteredList(delegates)
		}
	}, [delegates])

	const pageColumns: IPaginatedListColumn[] = [
		{
			key: 'requestor',
			name: 'Request from:',
			onRenderColumnItem: function onRenderColumnItem(delegate: Delegate): JSX.Element {
				return (
					<span>
						{delegate.name.first} {delegate.name.last}
					</span>
				)
			}
		},
		{
			key: 'requestedInfo',
			name: 'Requested info',
			onRenderColumnItem: function onRenderColumnItem(delegate: Delegate): JSX.Element {
				return <span>{delegate.organization.name}</span>
			}
		},
		{
			key: 'requestDate',
			name: 'Request date',
			onRenderColumnItem: function onRenderColumnItem(delegate: Delegate): JSX.Element {
				return <span>{new Date(delegate.dateAssigned).toLocaleDateString()}</span>
			}
		},
		{
			key: 'actionColumn',
			name: '',
			className: 'd-flex justify-content-end',
			onRenderColumnItem: function onRenderColumnItem(delegate: Delegate): JSX.Element {
				const columnActionButtons: IMultiActionButtons<Delegate>[] = [
					{
						name: 'Manage',
						className: cx(styles.manageButton)
					}
				]
				return <MultiActionButton columnItem={delegate} buttonGroup={columnActionButtons} />
			}
		}
	]

	return (
		<ClientOnly>
			<div className={cx('mt-5 mb-5 pb-3', styles.listWrapper)}>
				<PaginatedList
					title={title}
					description={
						'A list of requests for access to a part of your personal data.  You can accept or reject any of these requests, or ask for additional details about the request.'
					}
					list={filteredList}
					itemsPerPage={10}
					columns={pageColumns}
					columnsClassName={styles.headerRow}
					rowClassName={cx('align-items-center', styles.itemRow)}
					isLoading={loading}
				/>
			</div>
		</ClientOnly>
	)
})
export default DataAccessRequestList
