/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, ReactNode, ReactElement } from 'react'
import { Spinner } from '@fluentui/react'
import { Col, Row } from 'react-bootstrap'
import { PaginatedList as Paginator } from 'react-paginated-list'
import cx from 'classnames'
import type { StandardComponentProps } from '~types/StandardFC'
import styles from './index.module.scss'
import { get } from 'lodash'
import { useTranslation } from '~hooks/useTranslation'
import { nullFn } from '~utils/noop'
import { usePageItems } from './hooks'
import { IPaginatedListColumn } from './types'

export interface PaginatedDataProps<T> extends StandardComponentProps {
	data: T[]
	columns: IPaginatedListColumn[]
	isLoading: boolean
	isSearching: boolean
	itemsPerPage: number
	onPageChange: (items: T[], currentPage: number) => void
	overflowActive: boolean
	rowClassName?: string
}
export const PaginatedData = memo(function PaginatedData<T>({
	className,
	rowClassName,
	data,
	columns,
	itemsPerPage,
	isLoading,
	isSearching,
	onPageChange,
	overflowActive
}: PaginatedDataProps<T>): ReactElement {
	const { c } = useTranslation()
	const pageItems = usePageItems(itemsPerPage)
	return (
		<Paginator
			isLoading={isLoading}
			list={data}
			itemsPerPage={itemsPerPage}
			onPageChange={onPageChange}
			controlClass={cx(data.length <= itemsPerPage ? styles.noPaginator : styles.paginator)}
			loadingItem={() => {
				return (
					<div className={styles.loadingSpinner}>
						<Spinner className='waitSpinner' size={1} />
						<span>{c('paginatedList.loading')}</span>
					</div>
				)
			}}
			paginatedListContainerClass={cx(overflowActive ? className : null)}
			renderList={(items: T[]) => (
				<>
					{pageItems(data, items, isSearching).length > 0 ? (
						pageItems(data, items, isSearching).map((item: T, id: number) => {
							return (
								<Row key={id} className={cx(styles.itemRow, rowClassName)}>
									{columns.map((column: any, idx: number) => renderColumnItem(column, item, idx))}
								</Row>
							)
						})
					) : (
						<Row className={cx(styles.itemRow, rowClassName)}>
							<Col className={cx(styles.columnItem, styles.noResults)}>
								{c('paginatedList.noResults')}
							</Col>
						</Row>
					)}
				</>
			)}
		/>
	)
})

function renderColumnItem(
	{ onRenderColumnItem = nullFn, className, itemClassName, fieldName }: IPaginatedListColumn,
	item,
	index
): ReactNode {
	const renderOutside = onRenderColumnItem(item, index)
	if (renderOutside) {
		return (
			<Col key={index} className={cx(styles.columnItem, className, itemClassName)}>
				{onRenderColumnItem(item, index)}
			</Col>
		)
	} else {
		if (Array.isArray(fieldName)) {
			const fieldArr = fieldName.map((field: any) => `${get(item, field, field)}`)
			return (
				<Col key={index} className={cx(styles.columnItem, className, itemClassName)}>
					{fieldArr}
				</Col>
			)
		} else {
			return (
				<Col key={index} className={cx(styles.columnItem, className, itemClassName)}>
					{get(item, fieldName, fieldName)}
				</Col>
			)
		}
	}
}
