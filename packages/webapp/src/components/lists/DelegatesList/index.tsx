/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import ClientOnly from '~ui/ClientOnly'
import cx from 'classnames'

interface DelegatesListProps extends ComponentProps {
	title?: string
	delegates?: any
}

const DelegatesList = memo(function DelegatesList({
	title,
	delegates
}: DelegatesListProps): JSX.Element {
	const pageColumns: IPaginatedListColumn[] = [
		{
			key: 'name',
			name: 'Name',
			onRenderColumnItem: function onRenderColumnItem(delegate: any): JSX.Element {
				return (
					<span>
						{delegate.user.name.first} {delegate.user.name.last}
					</span>
				)
			}
		}
	]

	return (
		<ClientOnly>
			<div className={cx('mt-5 mb-5', styles.delegatesList)}>
				<PaginatedList
					title={title}
					list={delegates}
					itemsPerPage={10}
					columns={pageColumns}
					rowClassName='align-items-center'
					// onSearchValueChange={value => searchList(value)}
					// onPageChange={onPageChange}
					// isLoading={loading}
				/>
			</div>
		</ClientOnly>
	)
})
export default DelegatesList
