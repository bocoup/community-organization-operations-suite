/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useRef } from 'react'
import type { StandardFC } from '~types/StandardFC'
import { wrap } from '~utils/appinsights'
import type { IDropdownOption, IDropdownStyles } from '@fluentui/react'
import { Dropdown } from '@fluentui/react'
import { noop } from '~utils/noop'

export interface FieldData {
	id: string
	label: string
}
interface ShowFieldsFilterProps {
	options: IDropdownOption[]
	placeholder?: string
	onChange?: (option: IDropdownOption) => void
	selected?: string[]
}

const filterStyles: Partial<IDropdownStyles> = {
	root: {
		overflowWrap: 'break-word',
		inlineSize: 'fit-content'
	},
	callout: {
		minWidth: 'fit-content'
	},
	dropdown: {
		fontSize: 14,
		fontWeight: 600,
		border: 'none',
		':focus': {
			':after': {
				border: 'none'
			}
		}
	},
	title: {
		color: 'var(--bs-black)',
		border: 'none',
		height: 0,
		lineHeight: 'unset',
		whiteSpace: 'break-spaces',
		paddingLeft: 0,
		backgroundColor: 'transparent'
	},
	dropdownItemHeader: {
		color: 'var(--bs-gray-5)'
	},
	dropdownItemsWrapper: {
		border: '1px solid var(--bs-gray-4)',
		borderRadius: 4
	},
	dropdownItem: {
		fontSize: 12
	},
	dropdownItemSelected: {
		fontSize: 12,
		background: 'inherit',
		color: 'inherit'
	},
	dropdownItemSelectedAndDisabled: {
		fontSize: 12
	},
	dropdownOptionText: {
		fontSize: 12
	},
	subComponentStyles: {
		label: {},
		panel: {},
		multiSelectItem: {
			checkbox: {
				borderColor: 'var(--bs-gray-4)'
			}
		}
	}
}

export const ShowFieldsFilter: StandardFC<ShowFieldsFilterProps> = wrap(function ShowFieldsFilter({
	children,
	placeholder,
	options,
	onChange = noop,
	selected = []
}) {
	const titleRef = useRef<HTMLDivElement>()

	return (
		<Dropdown
			placeholder={placeholder}
			multiSelect
			options={options}
			selectedKeys={selected}
			styles={filterStyles}
			onRenderLabel={() => <div onClick={() => titleRef.current?.click()}>{children}</div>}
			onRenderTitle={() => <span ref={titleRef}> </span>}
			onRenderCaretDown={() => null}
			onChange={(_event, option) => {
				if (selected.length > 1 || option.selected) onChange(option)
			}}
		/>
	)
})
