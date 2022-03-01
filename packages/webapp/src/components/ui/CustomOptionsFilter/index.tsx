/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StandardFC } from '~types/StandardFC'
import { useEffect, useState, CSSProperties } from 'react'
import { wrap } from '~utils/appinsights'
import { Callout, Dropdown, Icon, IDropdownOption, IDropdownStyles } from '@fluentui/react'
import { useBoolean, useId } from '@fluentui/react-hooks'
import { noop } from '~utils/noop'
import { truncate } from 'lodash'

interface CustomOptionsFilterProps {
	filterLabel: string
	options: IDropdownOption[]
	placeholder?: string
	defaultSelectedKeys?: string[]
	onFilterChanged?: (option: IDropdownOption) => void
}

{
	/* const filterStyles: Partial<IDropdownStyles> = {
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
} */
}

const styles: CSSProperties = {
	display: 'inline-flex',
	fontWeight: '600',
	whiteSpace: 'nowrap'
}

export const CustomOptionsFilter: StandardFC<CustomOptionsFilterProps> = wrap(
	function CustomOptionsFilter({
		filterLabel,
		placeholder,
		options,
		defaultSelectedKeys,
		onFilterChanged = noop
	}) {
		const buttonId = useId('filter-callout-button')
		const [showCallout, { toggle: toggleShowCallout }] = useBoolean(false)
		const [selected, setSelected] = useState([])

		useEffect(() => {
			if (defaultSelectedKeys) {
				setSelected(defaultSelectedKeys)
			}
		}, [defaultSelectedKeys])

		const handleChange = function (option: IDropdownOption) {
			const _selected = [...selected]

			if (option.selected) {
				_selected.push(option.key)
			} else {
				_selected.splice(_selected.indexOf(option.key), 1)
			}

			setSelected(_selected)
			onFilterChanged(option)
		}

		const title = truncate(placeholder)

		{
			/* return (
			<Dropdown
				placeholder={title}
				title={title}
				multiSelect
				selectedKeys={selected}
				options={options}
				styles={filterStyles}
				onRenderCaretDown={() => <FilterIcon isSelected={selected.length > 0} />}
				onRenderTitle={() => title}
				onChange={(_event, option) => handleChange(option)}
			/>
		) */
		}

		const color = selected.length > 0 ? '#0078D4' : 'rgb(50, 49, 48)'
		const opacity = selected.length > 0 ? '1' : '.2'

		const iconstyle: CSSProperties = {
			display: 'block',
			fontSize: '10px',
			position: 'relative',
			lineHeight: 'var(--bs-body-line-height)',
			transform: 'translateY(3px)',
			color,
			opacity,
			marginLeft: '6px'
		}

		return (
			<>
				<span id={buttonId} style={styles}>
					{title}
					<Icon iconName='FilterSolid' onClick={toggleShowCallout} style={iconstyle} />
				</span>
				{showCallout && (
					<Callout
						gapSpace={0}
						target={`#${buttonId}`}
						isBeakVisible={false}
						onDismiss={toggleShowCallout}
						directionalHint={4}
						setInitialFocus
					>
						Hello MotherFucker
					</Callout>
				)}
			</>
		)
	}
)

const FilterIcon: StandardFC<{ isSelected: boolean }> = function ({ isSelected }) {
	const color = isSelected ? '#0078D4' : 'rgb(50, 49, 48)'
	const opacity = isSelected ? '1' : '.2'

	const style: CSSProperties = {
		display: 'block',
		fontSize: '10px',
		position: 'relative',
		lineHeight: 'var(--bs-body-line-height)',
		transform: 'translateY(3px)',
		color,
		opacity,
		marginLeft: '6px'
	}

	return <Icon iconName='FilterSolid' style={style} />
}
