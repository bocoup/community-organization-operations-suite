/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState, useRef, useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { collapsibleListsState } from '~store'
import { Col, Row } from 'react-bootstrap'
import cx from 'classnames'
import type { StandardComponentProps } from '~types/StandardFC'
import styles from './index.module.scss'
import { Collapsible } from '~ui/Collapsible'
import { noop, nullFn, empty } from '~utils/noop'
import { sortByAlphanumeric, SortingOrder } from '~utils/sortByAlphanumeric'
import { useOverflow } from './hooks'
import { CollapsibleListTitle, SimpleListTitle } from './ListTitle'
import { FilterOptions, IPaginatedListColumn } from './types'
import { ListSearch } from './ListSearch'
import { ActionButtons } from './ActionButtons'
import { ColumnHeaderRow } from './ColumnHeaderRow'
import { PaginatedData } from './PaginatedData'

interface PaginatedListProps<T> extends StandardComponentProps {
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
	list = empty,
	itemsPerPage,
	columns = empty,
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
	onSearchValueChange = noop,
	onListAddButtonClick = noop,
	onPageChange = noop,
	showSearch = true,
	filterOptions,
	onExportDataButtonClick = noop,
	onRenderListTitle = nullFn
}: PaginatedListProps<T>): JSX.Element {
	const paginatorWrapper = useRef()
	const listTitle = onRenderListTitle()
	const [isListSearching, setListSearching] = useState<boolean>(false)
	const [collapsibleState, setCollapsibleState] = useRecoilState(collapsibleListsState)
	const isOpen = collapsibleState[collapsibleStateName]
	const overflowActive = useOverflow(paginatorWrapper.current, [list, columns])
	const handleCollapserClick = useCallback(() => {
		if (collapsible) {
			setCollapsibleState({
				...collapsibleState,
				[collapsibleStateName]: !isOpen
			})
		}
	}, [collapsible, collapsibleStateName, isOpen, setCollapsibleState, collapsibleState])
	const handleSearchValueChanged = useCallback(
		(value: string) => {
			setListSearching(value.length > 0)
			onSearchValueChange(value)
		},
		[onSearchValueChange]
	)

	type ListSorting = {
		key: string
		order: SortingOrder
		getValue: Function
	}

	const [isListSorted, setListSorted] = useState<boolean>(false)
	const [listSortingInfo, setListSortingInfo] = useState<ListSorting>({
		key: columns?.[0]?.key ?? null,
		order: SortingOrder.ASC,
		getValue: nullFn
	})

	// List sorted based on user selected Header column and ASC/DESC order.
	const sortedList = !isListSorted
		? list
		: [...list].sort((itemA, itemB) => {
				return sortByAlphanumeric(
					listSortingInfo.getValue(itemA),
					listSortingInfo.getValue(itemB),
					listSortingInfo.order
				)
		  })

	/*
		Change sorting info based on state of the Header column:
		  - First click set the sorting to ASC
		  - Second click set the sorting to DESC
		  - Third click removing the sorting based on the Header column
		If a different Header column is selected, it's set to ASC and 
		remove the sorting from the previous Header column.
	 */
	const handleHeaderClick = (headerKey: string) => {
		const sortingInfo: ListSorting = {
			key: headerKey,
			order: null,
			getValue: columns.filter((column) => column.key === headerKey)?.[0]?.getValue ?? nullFn
		}
		let isSorted = true

		// New Header column
		if (sortingInfo.key != listSortingInfo.key) {
			sortingInfo.order = SortingOrder.ASC

			// Current Header columns
		} else {
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

		// Update the columns list to include sorting information
		columns.map((column) => {
			// Remove previous sorting information
			if (column.className) {
				column.className = column.className
					.replaceAll(/sorted-(?:A|DE)SC ?\b/gi, ' ')
					.replaceAll(/ {2,}/g, ' ') // clean double spaces
			}

			// Add sorting information
			if (column.key === sortingInfo.key && !!sortingInfo.order) {
				const sortingClass = ' sorted-' + SortingOrder[sortingInfo.order]
				column.className = (column.className ?? '') + sortingClass
			}
		})

		console.log(sortingInfo)
	}

	return (
		<>
			<Col
				className={cx(
					isMD ? null : 'ps-2',
					collapsible ? styles.listCollapse : '',
					collapsible && isOpen ? styles.listCollapseOpen : ''
				)}
			>
				<Row className={cx('mb-3', listTitle ? 'align-items-end' : 'align-items-center')}>
					{listTitle ? (
						<SimpleListTitle title={listTitle} />
					) : (
						<CollapsibleListTitle
							className='list-title'
							onCollapse={handleCollapserClick}
							title={title}
							listLength={list.length}
							collapsible={collapsible}
							collapsibleOpen={isOpen}
						/>
					)}
					<ListSearch
						className='list-search'
						collapsible={collapsible}
						collapsibleOpen={isOpen}
						filterOptions={filterOptions}
						showSearch={showSearch}
						onSearchChange={handleSearchValueChanged}
					/>
					<ActionButtons
						collapsible={collapsible}
						collapsibleOpen={isOpen}
						addButtonName={addButtonName}
						exportButtonName={exportButtonName}
						onAdd={onListAddButtonClick}
						onExport={onExportDataButtonClick}
					/>
				</Row>
			</Col>
			<Col
				ref={paginatorWrapper}
				className={cx(overflowActive ? paginatorContainerClassName : null)}
			>
				<Collapsible enabled={collapsible} in={isOpen}>
					<>
						{!hideListHeaders && (
							<ColumnHeaderRow
								className={columnsClassName}
								columns={columns}
								onHeaderClick={handleHeaderClick}
							/>
						)}
						<PaginatedData
							className={listItemsContainerClassName}
							rowClassName={rowClassName}
							data={sortedList}
							columns={columns}
							isLoading={isLoading}
							isSearching={isListSearching}
							itemsPerPage={itemsPerPage}
							onPageChange={onPageChange}
							overflowActive={overflowActive}
						/>
					</>
				</Collapsible>
			</Col>
		</>
	)
})
