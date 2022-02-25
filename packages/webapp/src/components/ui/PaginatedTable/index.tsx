/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState, useRef, useEffect, useCallback } from 'react'
import { Spinner } from '@fluentui/react'
import { Col } from 'react-bootstrap'
import { PaginatedList as Paginator } from 'react-paginated-list'
import cx from 'classnames'
import { IPaginatedTableColumn, PaginatedTableProps } from './types'
import styles from './index.module.scss'
import { get } from 'lodash'
import { useTranslation } from '~hooks/useTranslation'
import { noop, nullFn } from '~utils/noop'

// Sorting
import { ListSorting, SortingOrder } from '~types/Sorting'

export const PaginatedTable = memo(function PaginatedTable<T>({
	bodyRowClassName,
	className,
	columns,
	headerRowClassName,
	isLoading,
	itemsPerPage,
	list,
	onPageChange = noop,
	overFlowActiveClassName,
	paginatorContainerClassName,
	tableClassName
}: PaginatedTableProps<T>): JSX.Element {
	const { c } = useTranslation()
	const paginatorContainer = useRef<HTMLDivElement>()
	const paginatorWrapper = useRef<HTMLDivElement>()
	const [overflowActive, setOverflowActive] = useState(false)
	const [leftScrollPocketActive, setLeftScrollPocketActive] = useState(false)
	const [rightScrollPocketActive, setRightScrollPocketActive] = useState(false)
	const [scrollOffset, setScrollOffset] = useState(0)

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
		const container = paginatorContainer.current || null

		if (container) {
			setScrollOffset(container.scrollLeft)
			setLeftScrollPocketActive(container.scrollLeft > 0)
			setRightScrollPocketActive(
				(container.children[0] as HTMLElement).offsetWidth !== container.offsetWidth &&
					container.scrollLeft <
						(container.children[0] as HTMLElement).offsetWidth - container.offsetWidth
			)
		} else {
			setLeftScrollPocketActive(false)
			setRightScrollPocketActive(false)
		}
	}

	useEffect(() => {
		if (isOverflowActive()) {
			setOverflowActive(true)
		} else {
			setOverflowActive(false)
		}
	}, [list, columns, isOverflowActive])

	useEffect(() => {
		const container = paginatorContainer.current || null

		if (container) {
			container.addEventListener('scroll', onScroll)
			onScroll()
			return () => container.removeEventListener('scroll', onScroll)
		}
	}, [paginatorContainer])
	const fillerContentStyles = {
		width: paginatorWrapper.current ? paginatorWrapper.current.offsetWidth : undefined,
		transform: `translateX(${scrollOffset ?? 0}px)`
	}

	// ---------------------------------------------------- Sorting

	// Set the default sorting info, which as of now is the first sortable column
	let defaultSortingInfo = null
	const defaultSortableColumn = columns.find((c) => c.isSortable)
	if (!!defaultSortableColumn) {
		defaultSortingInfo = {
			key: defaultSortableColumn.key,
			order: SortingOrder.ASC,
			sortingValue: defaultSortableColumn?.sortingValue ?? nullFn,
			sortingFunction: defaultSortableColumn?.sortingFunction ?? nullFn
		}
	}

	const [listSortingInfo, setListSortingInfo] = useState<ListSorting>(defaultSortingInfo)
	const [isListSorted, setListSorted] = useState<boolean>(true)

	// List sorted based on user selected Header column and ASC/DESC order.
	const sortedList = !isListSorted
		? list
		: [...list].sort((itemA, itemB) => {
				return listSortingInfo.sortingFunction(
					listSortingInfo.sortingValue(itemA as Record<string, unknown>),
					listSortingInfo.sortingValue(itemB as Record<string, unknown>),
					listSortingInfo.order
				)
		  })

	// Sorting information for the column headers
	const columnsClassNames = !isListSorted
		? {}
		: columns.reduce((result, column) => {
				// Add sorting information
				if (column.key === listSortingInfo.key && !!listSortingInfo.order) {
					// Doing underscores instead of multi-class because of SCSS modules
					result[column.key] = 'sorted-' + SortingOrder[listSortingInfo.order]
				}
				return result
		  }, {})

	/*
		Set sorting info based on state of the header column.
		If a different Header column is selected, it's set to ASC and 
		remove the sorting from the previous Header column.
	 */
	function handleSorting(headerColumn: IPaginatedTableColumn): void {
		if (!headerColumn.isSortable) return

		// Assemble the sorting information for that column
		const sortingInfo: ListSorting = {
			key: headerColumn.key,
			order: SortingOrder.ASC,
			sortingValue: headerColumn?.sortingValue ?? nullFn,
			sortingFunction: headerColumn?.sortingFunction ?? nullFn
		}

		let isSorted = true

		// Change sorting order if clicking on the same header:
		// - First click set the sorting to ASC
		// - Second click set the sorting to DESC
		// - Third click remove the sorting
		if (sortingInfo.key === listSortingInfo?.key) {
			switch (listSortingInfo.order) {
				case SortingOrder.ASC:
					sortingInfo.order = SortingOrder.DESC
					break
				case SortingOrder.DESC:
					sortingInfo.order = null
					isSorted = false
					break
				default:
					sortingInfo.order = SortingOrder.ASC
			}
		}

		setListSortingInfo(sortingInfo)
		setListSorted(isSorted)
	}

	// ---------------------------------------------------- End sorting

	return (
		<div className={cx(styles.paginatorWrapper, className)} ref={paginatorWrapper}>
			<Col
				ref={paginatorContainer}
				className={cx(paginatorContainerClassName, overflowActive ? overFlowActiveClassName : null)}
			>
				<div className={cx(styles.table, tableClassName)}>
					<div className={styles.tableHeaders}>
						<div className={cx(styles.tableHeadersRow, headerRowClassName)}>
							{columns?.map((column: IPaginatedTableColumn, index: number) => {
								const { key, name, headerClassName, onRenderColumnHeader = nullFn } = column

								// Add the arrows next to the `name`
								const classList = cx(
									styles.tableHeadersCell,
									styles['tableHeadersCell_' + columnsClassNames[key]],
									headerClassName
								)

								return (
									<div key={key} className={classList} onClick={() => handleSorting(column)}>
										{onRenderColumnHeader(key, name, index) || name}
									</div>
								)
							})}
						</div>
					</div>
					<Paginator
						isLoading={isLoading}
						list={sortedList}
						itemsPerPage={itemsPerPage}
						onPageChange={onPageChange}
						controlClass={cx(styles.paginator)}
						loadingItem={() => {
							return (
								<div className={styles.loadingWrapper} style={fillerContentStyles}>
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
											<div className={styles.noResults} style={fillerContentStyles}>
												{c('paginatedList.noResults')}
											</div>
									  )}
							</>
						)}
					/>
				</div>
			</Col>
			<aside
				className={cx(
					styles.scrollPocket,
					styles.scrollPocketLeft,
					leftScrollPocketActive ? styles.scrollPocketActive : null
				)}
			>
				<div className={cx(styles.scrollPocketShadow, styles.scrollPocketShadowLeft)} />
				<div className={cx(styles.scrollPocketCaret, styles.scrollPocketCaretLeft)} />
			</aside>
			<aside
				className={cx(
					styles.scrollPocket,
					styles.scrollPocketRight,
					rightScrollPocketActive ? styles.scrollPocketActive : null
				)}
			>
				<div className={cx(styles.scrollPocketShadow, styles.scrollPocketShadowRight)} />
				<div className={cx(styles.scrollPocketCaret, styles.scrollPocketCaretRight)} />
			</aside>
		</div>
	)
})
