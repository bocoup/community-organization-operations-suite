/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { OptionType } from '../ReactSelect'

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
	getValue?: (contact: Contact) => string
	onRenderColumnHeader?: (key: string, name: string, index: number) => JSX.Element | string
	onRenderColumnItem?: (item: any, index: number) => JSX.Element | JSX.Element[] | string
	sortingClassName?: string
}
