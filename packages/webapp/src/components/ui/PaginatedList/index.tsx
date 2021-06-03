/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ComponentProps from '~types/ComponentProps'
import { PaginatedList as Paginator } from 'react-paginated-list'
import { Col, Row } from 'react-bootstrap'
import cx from 'classnames'
import styles from './index.module.scss'
import { get } from 'lodash'
import IconButton from '~ui/IconButton'
import { TextField } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
export interface IPaginatedListColumn {
	key: string
	name?: string
	className?: string
	fieldName?: string | Array<string>
	onRenderColumnHeader?: (key: string, name: string, index: number) => JSX.Element | string
	onRenderColumnItem?: (item: any, index: number) => JSX.Element | string
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
	onSearchValueChange?: (value: string) => void
	onListAddButtonClick?: () => void
	onPageChange?: (items: T[], currentPage: number) => void
}

export default function PaginatedList<T>({
	title,
	list,
	itemsPerPage,
	columns,
	columnsClassName,
	rowClassName,
	hideListHeaders = false,
	addButtonName,
	onSearchValueChange,
	onListAddButtonClick,
	onPageChange
}: PaginatedListProps<T>): JSX.Element {
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
		if (items.length < itemsPerPage && list.length > 0) {
			return list
		}

		return items
	}

	return (
		<>
			<Col>
				<Row className='align-items-center mb-3'>
					<Col md={2} xs={12}>
						{!!title && <h2 className={cx('d-flex align-items-center')}>{title}</h2>}
					</Col>
					<Col md={4} xs={7}>
						<TextField
							placeholder='Search'
							onChange={(_ev, searchVal) => {
								onSearchValueChange(searchVal)
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
					</Col>
					<Col md={6} xs={5} className='d-flex justify-content-end'>
						<IconButton
							icon='CircleAdditionSolid'
							text={addButtonName}
							onClick={() => onListAddButtonClick()}
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
									<Col className={cx(styles.columnItem, styles.noResults)}>No results found.</Col>
								</Row>
							)}
						</>
					)}
				/>
			</Col>
		</>
	)
}
