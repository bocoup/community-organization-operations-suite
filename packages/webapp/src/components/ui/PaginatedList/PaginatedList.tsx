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
	const [collapsibleState, setListsState] = useRecoilState(collapsibleListsState)
	const isCollapsibleOpen = collapsibleState[collapsibleStateName]
	const overflowActive = useOverflow(paginatorWrapper.current, [list, columns])
	const handleCollapserClick = useCallback(() => {
		if (collapsible) {
			setListsState({
				...collapsibleState,
				[collapsibleStateName]: !isCollapsibleOpen
			})
		}
	}, [collapsible, collapsibleStateName, isCollapsibleOpen, setListsState, collapsibleState])
	const handleSearchValueChanged = useCallback(
		(value: string) => {
			setListSearching(value.length > 0)
			onSearchValueChange(value)
		},
		[onSearchValueChange]
	)
	return (
		<>
			<Col
				className={cx(
					isMD ? null : 'ps-2',
					collapsible ? styles.listCollapse : '',
					collapsible && isCollapsibleOpen ? styles.listCollapseOpen : ''
				)}
			>
				<Row className={cx('mb-3', listTitle ? 'align-items-end' : 'align-items-center')}>
					{listTitle ? (
						<SimpleListTitle title={listTitle} />
					) : (
						<CollapsibleListTitle
							onCollapse={handleCollapserClick}
							title={title}
							listLength={list.length}
							collapsible={collapsible}
							collapsibleOpen={isCollapsibleOpen}
						/>
					)}
					<ListSearch
						collapsible={collapsible}
						collapsibleOpen={isCollapsibleOpen}
						filterOptions={filterOptions}
						showSearch={showSearch}
						onSearchChange={handleSearchValueChanged}
					/>
					<ActionButtons
						collapsible={collapsible}
						collapsibleOpen={isCollapsibleOpen}
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
				<Collapsible enabled={collapsible} in={isCollapsibleOpen}>
					<>
						{!hideListHeaders && <ColumnHeaderRow className={columnsClassName} columns={columns} />}
						<PaginatedData
							className={listItemsContainerClassName}
							rowClassName={rowClassName}
							data={list}
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
