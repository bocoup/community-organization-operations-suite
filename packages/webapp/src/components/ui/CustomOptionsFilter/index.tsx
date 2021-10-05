/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import type { ComponentProps } from '~types/ComponentProps'
import { wrap } from '~utils/appinsights'
import { Dropdown, FontIcon, IDropdownOption, IDropdownStyles } from '@fluentui/react'

interface CustomOptionsFilterProps extends ComponentProps {
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
		whiteSpace: 'break-spaces',
		paddingLeft: 0,
		backgroundColor: 'transparent'
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
	}
}

export const CustomOptionsFilter = wrap(
	memo(function CustomOptionsFilter({
		filterLabel,
		placeholder,
		options,
		onFilterChanged
	}: CustomOptionsFilterProps): JSX.Element {
		return (
			<>
				<Dropdown
					placeholder={placeholder}
					multiSelect
					options={options}
					styles={filterStyles}
					onRenderTitle={() => <>{filterLabel}</>}
					onRenderCaretDown={() => (
						<FontIcon
							iconName='FilterSolid'
							style={{ fontSize: '14px', position: 'relative', top: '-3px' }}
						/>
					)}
					onChange={(_event, option) => onFilterChanged?.(option)}
				/>
			</>
		)
	})
)
