/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StandardFC } from '~types/StandardFC'
import { useEffect, useState } from 'react'
import { wrap } from '~utils/appinsights'
import { Dropdown, FontIcon, IDropdownOption, IDropdownStyles } from '@fluentui/react'
import { noop } from '~utils/noop'

interface CustomOptionsFilterProps {
	filterLabel: string
	options: IDropdownOption[]
	placeholder?: string
	defaultSelectedKeys?: string[]
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
	function CustomOptionsFilter({
		filterLabel,
		placeholder,
		options,
		defaultSelectedKeys,
		onFilterChanged = noop
	}) {
		const [selected, setSelected] = useState([])

		useEffect(() => {
			if (defaultSelectedKeys) {
				setSelected(defaultSelectedKeys)
			}
		}, [defaultSelectedKeys])

		return (
			<Dropdown
				placeholder={placeholder.length > 30 ? placeholder.substring(0, 30) + '...' : placeholder}
				title={placeholder.length > 30 ? placeholder : ''}
				multiSelect
				selectedKeys={selected}
				options={options}
				styles={filterStyles}
				onRenderTitle={() => (
					<>{filterLabel.length > 30 ? filterLabel.substring(0, 30) + '...' : filterLabel}</>
				)}
				onRenderCaretDown={() => (
					<FontIcon
						iconName='FilterSolid'
						style={{
							display: 'block',
							fontSize: '10px',
							position: 'relative',
							lineHeight: 'var(--bs-body-line-height)',
							transform: 'translateY(3px)',
							color: selected.length > 0 ? '#0078D4' : 'rgb(50, 49, 48)',
							opacity: selected.length > 0 ? '1' : '.2'
						}}
					/>
				)}
				onChange={(_event, option) => {
					const _selected = [...selected]

					if (option.selected) {
						_selected.push(option.key)
					} else {
						_selected.splice(_selected.indexOf(option.key), 1)
					}

					setSelected(_selected)
					onFilterChanged(option)
				}}
			/>
		)
	}
)
