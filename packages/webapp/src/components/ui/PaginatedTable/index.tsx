/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState, useRef, useEffect, useCallback } from 'react'
import { Spinner } from '@fluentui/react'
import { Col, Row } from 'react-bootstrap'
import { PaginatedList as Paginator } from 'react-paginated-list'
import cx from 'classnames'

import type ComponentProps from '~types/ComponentProps'
import styles from './index.module.scss'
import { get } from 'lodash'
import IconButton from '~ui/IconButton'
import ClientOnly from '~ui/ClientOnly'
import { useTranslation } from '~hooks/useTranslation'
import ReactSelect, { OptionType } from '~ui/ReactSelect'

export interface IPaginatedListColumn {
	key: string
	name?: string
	headerClassName?: string
	itemClassName?: string
	fieldName?: string | Array<string>
	onRenderColumnHeader?: (key: string, name: string, index: number) => JSX.Element | string
	onRenderColumnItem?: (item: any, index: number) => JSX.Element | JSX.Element[] | string
}

export interface FilterOptions {
	onChange?: (filterValue: OptionType) => void
	options: OptionType[]
	className?: string
	fieldName?: string | Array<string>
}

interface PaginatedListProps<T> extends ComponentProps {
	title?: string
	list: T[]
	itemsPerPage: number
	columns: IPaginatedListColumn[]
	tableClassName?: string
	headerRowClassName?: string
	bodyRowClassName?: string
	paginatorContainerClassName?: string
	exportButtonName?: string
	isMD?: boolean
	isLoading?: boolean
	filterOptions?: FilterOptions
	reportOptions: OptionType[]
	reportOptionsDefaultInputValue?: string
	onPageChange?: (items: T[], currentPage: number) => void
	onExportDataButtonClick?: () => void
	onReportOptionChange?: (value: string) => void
}

const PaginatedTable = memo(function PaginatedTable<T>({
	title,
	className,
	list,
	itemsPerPage,
	columns,
	tableClassName,
	headerRowClassName,
	bodyRowClassName,
	paginatorContainerClassName,
	exportButtonName,
	isMD = true,
	isLoading,
	filterOptions,
	reportOptions,
	reportOptionsDefaultInputValue,
	onPageChange,
	onExportDataButtonClick,
	onReportOptionChange
}: PaginatedListProps<T>): JSX.Element {
	const { c } = useTranslation()
	const paginatorWrapper = useRef()
	const [overflowActive, setOverflowActive] = useState(false)

	const renderColumnItem = (column: IPaginatedListColumn, item, index): JSX.Element => {
		if (Array.isArray(column.fieldName)) {
			const fieldArr = column.fieldName.map((field: any) => {
				return `${get(item, field, field)}`
			})
			return (
				<Col key={index} className={cx(styles.columnItem, column.itemClassName)}>
					{fieldArr}
				</Col>
			)
		} else {
			return (
				<Col key={index} className={cx(styles.columnItem, column.itemClassName)}>
					{get(item, column.fieldName, column.fieldName)}
				</Col>
			)
		}
	}

	// logic to handle search results less than itemsPerPage
	const pageItems = (list: T[], items: T[]): T[] => {
		return items
	}

	const isOverflowActive = useCallback(() => {
		const element = paginatorWrapper.current as any
		return element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth
	}, [])

	useEffect(() => {
		if (isOverflowActive()) {
			setOverflowActive(true)
		} else {
			setOverflowActive(false)
		}
	}, [list, columns, isOverflowActive])

	return (
		<div className={className}>
			<Col className={cx(isMD ? null : 'ps-2')}>
				<Row className={cx('mb-3', 'align-items-end')}>
					{reportOptions && (
						<Col md={3} xs={12}>
							<div>
								<h2 className='mb-3'>{title}</h2>
								<div>
									{reportOptionsDefaultInputValue && (
										<ReactSelect
											options={reportOptions}
											defaultValue={reportOptions[0]}
											onChange={(option: OptionType) => onReportOptionChange?.(option?.value)}
										/>
									)}
								</div>
							</div>
						</Col>
					)}
					<Col md={6} xs={12}>
						<ClientOnly>
							<Row>
								{filterOptions && (
									<Col md={6} xs={12} className='mt-3 mb-0 mb-md-0'>
										<ReactSelect {...filterOptions} />
									</Col>
								)}
							</Row>
						</ClientOnly>
					</Col>
					<Col xs={3} className='d-flex justify-content-end'>
						<>
							{exportButtonName && columns.length > 0 && (
								<IconButton
									icon='DrillDownSolid'
									text={exportButtonName}
									onClick={() => onExportDataButtonClick?.()}
								/>
							)}
						</>
					</Col>
				</Row>
			</Col>
			<Col
				ref={paginatorWrapper}
				className={cx(overflowActive ? paginatorContainerClassName : null)}
			>
				<div className={cx(styles.table, tableClassName)}>
					<div className={styles.tableHeaders}>
						<div className={cx(styles.tableHeadersRow, headerRowClassName)}>
							{columns?.map((column: IPaginatedListColumn, index: number) => {
								return (
									<div key={index} className={cx(styles.tableHeadersCell, column.headerClassName)}>
										{column.onRenderColumnHeader?.(column.key, column.name, index) || column.name}
									</div>
								)
							})}
						</div>
					</div>
					<Paginator
						isLoading={isLoading}
						list={list}
						itemsPerPage={itemsPerPage}
						onPageChange={onPageChange}
						controlClass={cx(list.length <= itemsPerPage ? styles.noPaginator : styles.paginator)}
						loadingItem={() => {
							return (
								<div className={styles.loadingWrapper}>
									<div className={styles.loadingSpinner}>
										<Spinner className='waitSpinner' size={1} />
										<span>{c('paginatedList.loading')}</span>
									</div>
								</div>
							)
						}}
						paginatedListContainerClass={list.length > 0 ? styles.tableBody : styles.noTableBody}
						renderList={(items: T[]) => (
							<>
								{pageItems(list, items).length > 0
									? pageItems(list, items).map((item: T, id: number) => {
											return (
												<div key={id} className={cx(styles.tableBodyRow, bodyRowClassName)}>
													{columns?.map((column: IPaginatedListColumn, index: number) => {
														return (
															<div
																key={index}
																className={cx(styles.tableBodyCell, column.itemClassName)}
															>
																{column.onRenderColumnItem(item, index) ||
																	renderColumnItem(column, item, index)}
															</div>
														)
													})}
												</div>
											)
									  })
									: columns.length > 0 && (
											<div className={styles.noResults}>{c('paginatedList.noResults')}</div>
									  )}
							</>
						)}
					/>
				</div>
			</Col>
		</div>
	)
})
export default PaginatedTable
