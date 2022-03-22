/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { OptionType } from '../ReactSelect'
import type { SortingFunction, SortingValue } from '~types/Sorting'
import type { StandardComponentProps } from '~types/StandardFC'

export interface FilterOptions {
	onChange?: (filterValue: OptionType) => void
	options: OptionType[]
	className?: string
	fieldName?: string | Array<string>
}

export interface IPaginatedListColumn {
	key: string
	name?: string
	className?: string
	itemClassName?: string
	fieldName?: string | Array<string>
	onRenderColumnHeader?: (key: string, name: string, index: number) => JSX.Element | string
	onRenderColumnItem?: (item: any, index: number) => JSX.Element | JSX.Element[] | string
	isSortable?: boolean
	sortingClassName?: string
	sortingFunction?: SortingFunction
	sortingValue?: SortingValue
}

export interface PaginatedListProps<T> extends StandardComponentProps {
	title?: string
	list: T[]
	itemsPerPage: number
	columns: IPaginatedListColumn[]
	columnsClassName?: string
	rowClassName?: string
	paginatorContainerClassName?: string
	overflowActiveClassName?: string
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
