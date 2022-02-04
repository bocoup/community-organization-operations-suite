/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { OptionType } from '../ReactSelect'
import * as Sorting from '~types/Sorting'

export type OnHeaderClick = (headerKey: string) => void

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
	sortingFunction?: Sorting.Function
	sortingClassName?: string
	getValue?: (contact: Contact) => string
}
