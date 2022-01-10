/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState, useRef, useEffect, useCallback } from 'react'
import { Spinner } from '@fluentui/react'
import { Col, Row } from 'react-bootstrap'
import { PaginatedList as Paginator } from 'react-paginated-list'
import cx from 'classnames'
import type { StandardComponentProps } from '~types/StandardFC'
import styles from './index.module.scss'
import { get } from 'lodash'
import { useTranslation } from '~hooks/useTranslation'
import { noop, nullFn } from '~utils/noop'

export interface IPaginatedTableColumn {
	key: string
	name?: string
	headerClassName?: string
	itemClassName?: string
	fieldName?: string | Array<string>
	onRenderColumnHeader?: (key: string, name: string, index: number) => JSX.Element | string
	onRenderColumnItem?: (item: any, index: number) => JSX.Element | JSX.Element[] | string
}

interface PaginatedTableProps<T> extends StandardComponentProps {
	list: T[]
	itemsPerPage: number
	columns: IPaginatedTableColumn[]
	tableClassName?: string
	headerRowClassName?: string
	bodyRowClassName?: string
	paginatorContainerClassName?: string
	isMD?: boolean
	isLoading?: boolean
	onPageChange?: (items: T[], currentPage: number) => void
}

export const PaginatedTable = memo(function PaginatedTable<T>({
	className,
	list,
	itemsPerPage,
	columns,
	tableClassName,
	headerRowClassName,
	bodyRowClassName,
	paginatorContainerClassName,
	isMD = true,
	isLoading,
	onPageChange = noop
}: PaginatedTableProps<T>): JSX.Element {
	const { c } = useTranslation()
	const paginatorContainer = useRef()
	const [overflowActive, setOverflowActive] = useState(false)
	const [leftScrollPocketActive, setLeftScrollPocketActive] = useState(false)
	const [rightScrollPocketActive, setRightScrollPocketActive] = useState(false)

	const renderColumnItem = (column: IPaginatedTableColumn, item, index): JSX.Element => {
		if (Array.isArray(column.name)) {
			const fieldArr = column.name.map((field: any) => {
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
					{get(item, column.name, column.name)}
				</Col>
			)
		}
	}

	// logic to handle search results less than itemsPerPage
	const pageItems = (list: T[], items: T[]): T[] => {
		return items
	}

	const isOverflowActive = useCallback(() => {
		const element = paginatorContainer.current as any
		return element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth
	}, [])

	const onScroll = () => {
		const wrapper = paginatorContainer.current
		setLeftScrollPocketActive(wrapper.scrollLeft > 0)
		setRightScrollPocketActive(
			wrapper.children[0].offsetWidth !== wrapper.offsetWidth &&
				wrapper.scrollLeft < wrapper.children[0].offsetWidth - wrapper.offsetWidth
		)
	}

	useEffect(() => {
		if (isOverflowActive()) {
			setOverflowActive(true)
		} else {
			setOverflowActive(false)
		}
		paginatorContainer.current.addEventListener('scroll', onScroll)
		onScroll()

		return () => window.removeEventListener('scroll', onScroll)
	}, [list, columns, isOverflowActive])

	return (
		<div className={className}>
			<Col className={cx(isMD ? null : 'ps-2')}>
				<Row className={cx('mb-3', 'align-items-end')}></Row>
			</Col>
			<div className={styles.paginatorWrapper}>
				<Col
					ref={paginatorContainer}
					className={cx(overflowActive ? paginatorContainerClassName : null)}
				>
					<div className={cx(styles.table, tableClassName)}>
						<div className={styles.tableHeaders}>
							<div className={cx(styles.tableHeadersRow, headerRowClassName)}>
								{columns?.map(
									(
										{
											key,
											name,
											headerClassName,
											onRenderColumnHeader = nullFn
										}: IPaginatedTableColumn,
										index: number
									) => {
										return (
											<div key={index} className={cx(styles.tableHeadersCell, headerClassName)}>
												{onRenderColumnHeader(key, name, index) || name}
											</div>
										)
									}
								)}
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
														{columns?.map((column: IPaginatedTableColumn, index: number) => {
															return (
																<div
																	key={index}
																	className={cx(styles.tableBodyCell, column.itemClassName)}
																>
																	{column.onRenderColumnItem(item, index) ??
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
				<div
					className={cx(
						styles.scrollPocket,
						styles.scrollPocketLeft,
						leftScrollPocketActive ? styles.scrollPocketActive : null
					)}
				>
					<div className={cx(styles.scrollPocketShadow, styles.scrollPocketShadowLeft)}></div>
					<div className={cx(styles.scrollPocketCaret, styles.scrollPocketCaretLeft)}></div>
				</div>
				<div
					className={cx(
						styles.scrollPocket,
						styles.scrollPocketRight,
						rightScrollPocketActive ? styles.scrollPocketActive : null
					)}
				>
					<div className={cx(styles.scrollPocketShadow, styles.scrollPocketShadowRight)}></div>
					<div className={cx(styles.scrollPocketCaret, styles.scrollPocketCaretRight)}></div>
				</div>
			</div>
		</div>
	)
})
