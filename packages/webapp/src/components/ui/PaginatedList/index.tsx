/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState } from 'react'
import { TextField } from '@fluentui/react'
import { Col, Row } from 'react-bootstrap'
import { PaginatedList as Paginator } from 'react-paginated-list'
import cx from 'classnames'

import type ComponentProps from '~types/ComponentProps'
import styles from './index.module.scss'
import { get } from 'lodash'
import IconButton from '~ui/IconButton'
import ClientOnly from '~ui/ClientOnly'
import { useTranslation } from '~hooks/useTranslation'
export interface IPaginatedListColumn {
	key: string
	name?: string
	className?: string
	fieldName?: string | Array<string>
	onRenderColumnHeader?: (key: string, name: string, index: number) => JSX.Element | string
	onRenderColumnItem?: (item: any, index: number) => JSX.Element | JSX.Element[] | string
}

interface PaginatedListProps<T> extends ComponentProps {
	title?: string
	list: T[]
	itemsPerPage: number
	columns: IPaginatedListColumn[]
	columnsClassName?: string
	rowClassName?: string
	hideListHeaders?: boolean
	addButtonName: string
	exportButtonName?: string
	isMD?: boolean
	onSearchValueChange?: (value: string) => void
	onListAddButtonClick?: () => void
	onPageChange?: (items: T[], currentPage: number) => void
	onExportDataButtonClick?: () => void
}

const PaginatedList = memo(function PaginatedList<T>({
	title,
	list,
	itemsPerPage,
	columns,
	columnsClassName,
	rowClassName,
	hideListHeaders = false,
	addButtonName,
	exportButtonName,
	isMD = true,
	onSearchValueChange,
	onListAddButtonClick,
	onPageChange,
	onExportDataButtonClick
}: PaginatedListProps<T>): JSX.Element {
	const { t } = useTranslation('common')
	const [isListSearching, setListSearching] = useState<boolean>(false)

	const renderColumnItem = (column: IPaginatedListColumn, item, index): JSX.Element => {
		const renderOutside = column.onRenderColumnItem?.(item, index)
		if (renderOutside) {
			return (
				<Col key={index} className={cx(styles.columnItem, column.className)}>
					{column.onRenderColumnItem(item, index)}
				</Col>
			)
		} else {
			if (Array.isArray(column.fieldName)) {
				const fieldArr = column.fieldName.map((field: any) => {
					return `${get(item, field, field)}`
				})
				return (
					<Col key={index} className={cx(styles.columnItem, column.className)}>
						{fieldArr}
					</Col>
				)
			} else {
				return (
					<Col key={index} className={cx(styles.columnItem, column.className)}>
						{get(item, column.fieldName, column.fieldName)}
					</Col>
				)
			}
		}
	}

	// logic to handle search results less than itemsPerPage
	const pageItems = (list: T[], items: T[]): T[] => {
		if (isListSearching && items.length < itemsPerPage && list.length > 0) {
			return list
		}

		return items
	}

	return (
		<>
			<Col className={isMD ? null : 'ps-2'}>
				<Row className='align-items-center mb-3'>
					<Col md={2} xs={12}>
						{!!title && <h2 className={cx('d-flex align-items-center')}>{title}</h2>}
					</Col>
					<Col md={4} xs={7}>
						<ClientOnly>
							<TextField
								placeholder={t('paginatedList.search')}
								onChange={(_ev, searchVal) => {
									setListSearching(searchVal.length > 0)
									onSearchValueChange?.(searchVal)
								}}
								styles={{
									fieldGroup: {
										borderRadius: 4,
										':after': {
											borderRadius: 4
										}
									}
								}}
								iconProps={{
									iconName: 'Search'
								}}
							/>
						</ClientOnly>
					</Col>
					<Col md={6} xs={5} className='d-flex justify-content-end'>
						{exportButtonName && (
							<IconButton
								icon='DrillDownSolid'
								text={exportButtonName}
								onClick={() => onExportDataButtonClick?.()}
							/>
						)}
						<IconButton
							icon='CircleAdditionSolid'
							text={addButtonName}
							onClick={() => onListAddButtonClick?.()}
						/>
					</Col>
				</Row>
			</Col>
			<Col>
				{!hideListHeaders && (
					<Row className={cx(styles.columnHeaderRow, columnsClassName)}>
						{columns.map((column: IPaginatedListColumn, idx: number) => {
							return (
								column.onRenderColumnHeader?.(column.key, column.name, idx) || (
									<Col key={idx} className={cx(styles.columnItem, column.className)}>
										{column.name}
									</Col>
								)
							)
						})}
					</Row>
				)}
				<Paginator
					list={list}
					itemsPerPage={itemsPerPage}
					onPageChange={onPageChange}
					controlClass={cx(styles.paginator)}
					renderList={(items: T[]) => (
						<>
							{pageItems(list, items).length > 0 ? (
								pageItems(list, items).map((item: T, id: number) => {
									return (
										<Row key={id} className={cx(styles.itemRow, rowClassName)}>
											{columns.map((column: any, idx: number) => {
												return renderColumnItem(column, item, idx)
											})}
										</Row>
									)
								})
							) : (
								<Row className={cx(styles.itemRow, rowClassName)}>
									<Col className={cx(styles.columnItem, styles.noResults)}>
										{t('paginatedList.noResults')}
									</Col>
								</Row>
							)}
						</>
					)}
				/>
			</Col>
		</>
	)
})
export default PaginatedList
