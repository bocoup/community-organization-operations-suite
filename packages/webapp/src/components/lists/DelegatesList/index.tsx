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
interface DelegatesListProps extends ComponentProps {
	title?: string
	delegates?: Delegate[]
	loading?: boolean
}

const DelegatesList = memo(function DelegatesList({
	title,
	delegates,
	loading
}: DelegatesListProps): JSX.Element {
	const [filteredList, setFilteredList] = useState<Delegate[]>(delegates)

	useEffect(() => {
		if (delegates) {
			setFilteredList(delegates)
		}
	}, [delegates])

	const pageColumns: IPaginatedListColumn[] = [
		{
			key: 'name',
			name: 'Name',
			onRenderColumnItem: function onRenderColumnItem(delegate: Delegate): JSX.Element {
				return (
					<span>
						{delegate.name.first} {delegate.name.last}
					</span>
				)
			}
		},
		{
			key: 'orgNames',
			name: 'Manages your data with',
			onRenderColumnItem: function onRenderColumnItem(delegate: Delegate): JSX.Element {
				return <span>{delegate.organization.name}</span>
			}
		},
		{
			key: 'assignedOn',
			name: 'Assigned',
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
			<div className={cx('mt-5 mb-5', styles.listWrapper)}>
				<PaginatedList
					title={title}
					description={
						'Delegates are organizations that you have given permission to manage the sharing of your personal data.  You can view your approved delegates in the table below, and manage their access and approval to share your data there.  You can also add, or remove, a delegate at any time.'
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
export default DelegatesList
