/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState, useRef, useEffect, useCallback } from 'react'
import { Spinner } from '@fluentui/react'
import { Col, Row } from 'react-bootstrap'
import { PaginatedList as Paginator } from 'react-paginated-list'
import cx from 'classnames'
import { IPaginatedTableColumn, PaginatedTableProps } from './types'
import styles from './index.module.scss'
import { get } from 'lodash'
import { useTranslation } from '~hooks/useTranslation'
import { noop, nullFn } from '~utils/noop'

export const PaginatedTable = memo(function PaginatedTable<T>({
	className,
	list,
	itemsPerPage,
	columns,
	tableClassName,
	headerRowClassName,
	bodyRowClassName,
	paginatorContainerClassName,
	overFlowActiveClassName,
	isMD = true,
	isLoading,
	onPageChange = noop
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

	return (
		<div className={className}>
			<Col className={cx(isMD ? null : 'ps-2')}>
				<Row className={cx('mb-3', 'align-items-end')}></Row>
			</Col>
			<div className={styles.paginatorWrapper} ref={paginatorWrapper}>
				<Col
					ref={paginatorContainer}
					className={cx(
						paginatorContainerClassName,
						overflowActive ? overFlowActiveClassName : null
					)}
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
											<div key={key} className={cx(styles.tableHeadersCell, headerClassName)}>
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
