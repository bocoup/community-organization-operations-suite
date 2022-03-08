/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { StandardComponentProps } from '~types/StandardFC'
import type { SortingFunction, SortingValue } from '~types/Sorting'

export interface IPaginatedTableColumn {
	key: string
	name?: string
	headerClassName?: string
	itemClassName?: string
	fieldName?: string | Array<string>
	onRenderColumnHeader?: (key: string, name: string, index: number) => JSX.Element | string
	onRenderColumnItem?: (item: any, index: number) => JSX.Element | JSX.Element[] | string
	isSortable?: boolean
	sortingClassName?: string
	sortingFunction?: SortingFunction
	sortingValue?: SortingValue
}

export interface PaginatedTableProps<T> extends StandardComponentProps {
	list: T[]
	itemsPerPage: number
	columns: IPaginatedTableColumn[]
	tableClassName?: string
	headerRowClassName?: string
	bodyRowClassName?: string
	paginatorContainerClassName?: string
	overFlowActiveClassName?: string
	isMD?: boolean
	isLoading?: boolean
	onPageChange?: (items: T[], currentPage: number) => void
}
