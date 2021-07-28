/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState, Fragment } from 'react'
import { TextField, Spinner } from '@fluentui/react'
import { Col, Row, Collapse } from 'react-bootstrap'
import { PaginatedList as Paginator } from 'react-paginated-list'
import cx from 'classnames'

import type ComponentProps from '~types/ComponentProps'
import styles from './index.module.scss'
import { get } from 'lodash'
import IconButton from '~ui/IconButton'
import ClientOnly from '~ui/ClientOnly'
import { useTranslation } from '~hooks/useTranslation'
import Icon from '../Icon'
import FadeIn from '../FadeIn'
export interface IPaginatedListColumn {
	key: string
	name?: string
	className?: string
	fieldName?: string | Array<string>
	onRenderColumnHeader?: (key: string, name: string, index: number) => JSX.Element | string
	onRenderColumnItem?: (item: any, index: number) => JSX.Element | JSX.Element[] | string
}

interface PaginatedListProps<T> extends ComponentProps {
	scrollRef?: HTMLElement
	title?: string
	list: T[]
	itemsPerPage: number
	columns: IPaginatedListColumn[]
	columnsClassName?: string
	rowClassName?: string
	hideListHeaders?: boolean
	addButtonName?: string
	exportButtonName?: string
	isMD?: boolean
	isLoading?: boolean
	collapsible?: boolean
	isOpen?: boolean
	handleCollapserClick?: () => void
	onSearchValueChange?: (value: string) => void
	onListAddButtonClick?: () => void
	onPageChange?: (items: T[], currentPage: number) => void
	onExportDataButtonClick?: () => void
}

const PaginatedList = memo(function PaginatedList<T>({
	scrollRef = null,
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
	isLoading,
	collapsible = false,
	isOpen = true,
	handleCollapserClick = () => {},
	onSearchValueChange,
	onListAddButtonClick,
	onPageChange,
	onExportDataButtonClick
}: PaginatedListProps<T>): JSX.Element {
	const { c } = useTranslation()
	const [isListSearching, setListSearching] = useState<boolean>(false)

	// const isCollapsibleAndOpen = () => {
	// 	return collapsible
	// }

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

	const withCollapseWrapperIfCollapsible = wrapped => {
		const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false)
		// const [isClosing, setIsClosing] = useState(false)

		return collapsible ? (
			<Collapse
				in={isOpen}
				onEnter={() => setIsCollapsibleOpen(true)}
				onExited={() => setIsCollapsibleOpen(false)}
			>
				<div
					className={cx(isCollapsibleOpen ? styles.openCollapsible : '', styles.collapsibleWrapper)}
				>
					{wrapped}
				</div>
			</Collapse>
		) : (
			<div>{wrapped}</div>
		)
	}

	return (
		<>
			<Col ref={scrollRef} className={isMD ? null : 'ps-2'}>
				<Row className='align-items-center mb-3'>
					<Col
						md={3}
						xs={12}
						className={cx(styles.collapser)}
						onClick={collapsible ? handleCollapserClick : () => {}}
					>
						<div className={cx('d-flex align-items-center', styles.collapsibleHeader)}>
							{collapsible && (
								<Icon
									iconName='ChevronRight'
									className={cx(isOpen ? styles.rotateChev : '', styles.collapsibleIcon)}
								/>
							)}
							{!!title && <h2>{title}</h2>}
						</div>
					</Col>
					<Col md={3} xs={7}>
						<ClientOnly>
							{withCollapseWrapperIfCollapsible(
								<TextField
									placeholder={c('paginatedList.search')}
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
							)}
						</ClientOnly>
					</Col>
					<Col md={6} xs={5} className='d-flex justify-content-end'>
						{withCollapseWrapperIfCollapsible(
							<Fragment>
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
										onClick={() => onListAddButtonClick?.()}
									/>
								)}
							</Fragment>
						)}
					</Col>
				</Row>
			</Col>
			<Col>
				{withCollapseWrapperIfCollapsible(
					<Fragment>
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
							isLoading={isLoading}
							list={list}
							itemsPerPage={itemsPerPage}
							onPageChange={onPageChange}
							controlClass={cx(styles.paginator)}
							loadingItem={() => {
								return (
									<div className={styles.loadingSpinner}>
										<Spinner size={1} />
										<span>{c('paginatedList.loading')}</span>
									</div>
								)
							}}
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
					</Fragment>
				)}
			</Col>
		</>
	)
})
export default PaginatedList
