/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState, useRef, useEffect, useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { collapsibleListsState } from '~store'
import { TextField, Spinner } from '@fluentui/react'
import { Col, Row } from 'react-bootstrap'
import { PaginatedList as Paginator } from 'react-paginated-list'
import cx from 'classnames'

import type { ComponentProps } from '~types/ComponentProps'
import styles from './index.module.scss'
import { get } from 'lodash'
import { IconButton } from '~ui/IconButton'
import { useTranslation } from '~hooks/useTranslation'
import { Icon } from '../Icon'
import { Collapsible } from '~ui/Collapsible'
import { ReactSelect, OptionType } from '~ui/ReactSelect'

export interface IPaginatedListColumn {
	key: string
	name?: string
	className?: string
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

const NO_ITEMS = []

interface PaginatedListProps<T> extends ComponentProps {
	title?: string
	list: T[]
	itemsPerPage: number
	columns: IPaginatedListColumn[]
	columnsClassName?: string
	rowClassName?: string
	paginatorContainerClassName?: string
	listItemsContainerClassName?: string
	hideListHeaders?: boolean
	addButtonName?: string
	exportButtonName?: string
	isMD?: boolean
	isLoading?: boolean
	collapsible?: boolean
	collapsibleStateName?: string
	showSearch?: boolean
	showFilter?: boolean
	filterOptions?: FilterOptions
	onRenderListTitle?: () => JSX.Element | string | undefined
	onFilterChange?: (value: string) => void
	onSearchValueChange?: (value: string) => void
	onListAddButtonClick?: () => void
	onPageChange?: (items: T[], currentPage: number) => void
	onExportDataButtonClick?: () => void
}

export const PaginatedList = memo(function PaginatedList<T>({
	title,
	list = NO_ITEMS,
	itemsPerPage,
	columns,
	columnsClassName,
	rowClassName,
	paginatorContainerClassName,
	listItemsContainerClassName,
	hideListHeaders = false,
	addButtonName,
	exportButtonName,
	isMD = true,
	isLoading,
	collapsible = false,
	collapsibleStateName,
	onSearchValueChange,
	onListAddButtonClick,
	onPageChange,
	showSearch = true,
	filterOptions,
	onExportDataButtonClick,
	onRenderListTitle
}: PaginatedListProps<T>): JSX.Element {
	const { c } = useTranslation()
	const [isListSearching, setListSearching] = useState<boolean>(false)
	const [collapsibleState, setListsState] = useRecoilState(collapsibleListsState)
	const isCollapsibleOpen = collapsibleState[collapsibleStateName]
	const paginatorWrapper = useRef()
	const [overflowActive, setOverflowActive] = useState(false)

	const renderColumnItem = (column: IPaginatedListColumn, item, index): JSX.Element => {
		const renderOutside = column.onRenderColumnItem?.(item, index)
		if (renderOutside) {
			return (
				<Col key={index} className={cx(styles.columnItem, column.className, column.itemClassName)}>
					{column.onRenderColumnItem(item, index)}
				</Col>
			)
		} else {
			if (Array.isArray(column.fieldName)) {
				const fieldArr = column.fieldName.map((field: any) => {
					return `${get(item, field, field)}`
				})
				return (
					<Col
						key={index}
						className={cx(styles.columnItem, column.className, column.itemClassName)}
					>
						{fieldArr}
					</Col>
				)
			} else {
				return (
					<Col
						key={index}
						className={cx(styles.columnItem, column.className, column.itemClassName)}
					>
						{get(item, column.fieldName, column.fieldName)}
					</Col>
				)
			}
		}
	}

	// logic to handle search results less than itemsPerPage
	const pageItems = (list: T[], items: T[]): T[] => {
		list = list || []
		items = items || []
		if (isListSearching && items.length < itemsPerPage && list.length > 0) {
			return list
		}

		return items
	}

	const handleCollapserClick = () => {
		if (collapsible) {
			setListsState({
				...collapsibleState,
				[collapsibleStateName]: !isCollapsibleOpen
			})
		}
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
		<>
			<Col
				className={cx(
					isMD ? null : 'ps-2',
					collapsible ? styles.listCollapse : '',
					collapsible && isCollapsibleOpen ? styles.listCollapseOpen : ''
				)}
			>
				<Row className={cx('mb-3', onRenderListTitle ? 'align-items-end' : 'align-items-center')}>
					{onRenderListTitle ? (
						<Col md={3} xs={12}>
							{onRenderListTitle()}
						</Col>
					) : (
						<Col
							md={3}
							xs={12}
							className={cx(collapsible ? styles.collapser : '')}
							onClick={handleCollapserClick}
						>
							<div
								className={cx(
									'd-flex align-items-center',
									collapsible ? styles.collapsibleHeader : ''
								)}
							>
								{collapsible && (
									<Icon
										iconName='ChevronRight'
										className={cx(
											styles.collapsibleIcon,
											isCollapsibleOpen ? styles.rotateChev : ''
										)}
									/>
								)}
								{!!title && (
									<h2 className='mb-3'>
										{title} ({list.length})
									</h2>
								)}
							</div>
						</Col>
					)}
					<Col md={6} xs={12}>
						<Collapsible enabled={collapsible} in={isCollapsibleOpen}>
							<Row>
								{filterOptions && (
									<Col md={6} xs={12} className='mb-3 mb-md-0'>
										<ReactSelect {...filterOptions} />
									</Col>
								)}
								<Col md={6} xs={12}>
									{showSearch && (
										<TextField
											placeholder={c('paginatedList.search')}
											onChange={(_ev, searchVal) => {
												setListSearching(searchVal.length > 0)
												onSearchValueChange?.(searchVal)
											}}
											styles={{
												field: {
													fontSize: 12,
													paddingRight: 30,
													':after': {
														paddingRight: 30
													},
													'::placeholder': {
														fontSize: 14,
														color: 'var(--bs-text-muted)'
													}
												},
												fieldGroup: {
													height: 36,
													borderColor: 'var(--bs-gray-4)',
													borderRadius: 4,
													':hover': {
														borderColor: 'var(--bs-primary)'
													},
													':after': {
														borderRadius: 4,
														borderWidth: 1
													}
												}
											}}
											iconProps={{
												iconName: 'Search',
												styles: {
													root: {
														bottom: 8,
														color: 'var(--bs-text-muted)'
													}
												}
											}}
										/>
									)}
								</Col>
							</Row>
						</Collapsible>
					</Col>
					<Col xs={3} className='d-flex justify-content-end'>
						<Collapsible enabled={collapsible} in={isCollapsibleOpen}>
							<>
								{exportButtonName && (
									<IconButton
										icon='DrillDownSolid'
										text={exportButtonName}
										onClick={() => onExportDataButtonClick?.()}
									/>
								)}
								{addButtonName && (
									<IconButton
										icon='CircleAdditionSolid'
										text={addButtonName}
										className='btnAddItem'
										onClick={() => onListAddButtonClick?.()}
									/>
								)}
							</>
						</Collapsible>
					</Col>
				</Row>
			</Col>
			<Col
				ref={paginatorWrapper}
				className={cx(overflowActive ? paginatorContainerClassName : null)}
			>
				<Collapsible enabled={collapsible} in={isCollapsibleOpen}>
					<>
						{!hideListHeaders && (
							<Row className={cx(styles.columnHeaderRow, columnsClassName)}>
								{columns?.map((column: IPaginatedListColumn, idx: number) => {
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
							isLoading={isLoading}
							list={list}
							itemsPerPage={itemsPerPage}
							onPageChange={onPageChange}
							controlClass={cx(
								list?.length <= itemsPerPage ? styles.noPaginator : styles.paginator
							)}
							loadingItem={() => {
								return (
									<div className={styles.loadingSpinner}>
										<Spinner className='waitSpinner' size={1} />
										<span>{c('paginatedList.loading')}</span>
									</div>
								)
							}}
							paginatedListContainerClass={cx(overflowActive ? listItemsContainerClassName : null)}
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
												{c('paginatedList.noResults')}
											</Col>
										</Row>
									)}
								</>
							)}
						/>
					</>
				</Collapsible>
			</Col>
		</>
	)
})
