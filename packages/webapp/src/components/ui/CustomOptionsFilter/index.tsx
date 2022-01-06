/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StandardFC } from '~types/StandardFC'
import { wrap } from '~utils/appinsights'
import { Dropdown, FontIcon, IDropdownOption, IDropdownStyles } from '@fluentui/react'
import { noop } from '~utils/noop'

interface CustomOptionsFilterProps {
	filterLabel: string
	options: IDropdownOption[]
	placeholder?: string
	onFilterChanged?: (option: IDropdownOption) => void
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
		height: 'auto',
		lineHeight: 'unset',
		paddingLeft: 0,
		backgroundColor: 'transparent',
		whiteSpace: 'nowrap'
	},
	dropdownItemsWrapper: {
		border: '1px solid var(--bs-gray-4)',
		borderRadius: 4
	},
	dropdownItem: {
		fontSize: 12
	},
	dropdownItemSelected: {
		fontSize: 12
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
	},
	caretDownWrapper: {
		height: 'auto'
	}
}

export const CustomOptionsFilter: StandardFC<CustomOptionsFilterProps> = wrap(
	function CustomOptionsFilter({ filterLabel, placeholder, options, onFilterChanged = noop }) {
		return (
			<Dropdown
				placeholder={placeholder}
				multiSelect
				options={options}
				styles={filterStyles}
				onRenderTitle={() => <>{filterLabel}</>}
				onRenderCaretDown={() => (
					<FontIcon
						iconName='FilterSolid'
						style={{
							display: 'block',
							fontSize: '10px',
							position: 'relative',
							lineHeight: 'var(--bs-body-line-height)',
							transform: 'translateY(3px)',
							opacity: '.2'
						}}
					/>
				)}
				onChange={(_event, option) => onFilterChanged(option)}
			/>
		)
	}
)
