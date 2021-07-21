/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useCallback, useEffect, useState } from 'react'
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

	const searchList = useCallback(
		(searchStr: string) => {
			const filteredDelegates = delegates.filter(
				(e: Delegate) =>
					e.name.first.toLowerCase().includes(searchStr.toLowerCase()) ||
					e.name.last.toLowerCase().includes(searchStr.toLowerCase())
			)
			setFilteredList(filteredDelegates)
		},
		[delegates]
	)

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
				return <span>{delegate.organizations.map(org => org.name).join(', ')}</span>
			}
		},
		{
			key: 'actionColumn',
			name: '',
			className: 'd-flex justify-content-end',
			onRenderColumnItem: function onRenderColumnItem(delegate: Delegate): JSX.Element {
				const columnActionButtons: IMultiActionButtons<Delegate>[] = [
					{
						name: 'Delete delegate',
						className: cx(styles.deleteButton)
					}
				]
				return <MultiActionButton columnItem={delegate} buttonGroup={columnActionButtons} />
			}
		}
	]

	return (
		<ClientOnly>
			<div className={cx('mt-5 mb-5', styles.delegatesList)}>
				<PaginatedList
					title={title}
					list={filteredList}
					itemsPerPage={10}
					columns={pageColumns}
					rowClassName={cx('align-items-center', styles.delegateRow)}
					onSearchValueChange={value => searchList(value)}
					isLoading={loading}
				/>
			</div>
		</ClientOnly>
	)
})
export default DelegatesList
