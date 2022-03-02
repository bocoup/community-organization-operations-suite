/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StandardFC } from '~types/StandardFC'
import { useEffect, useState } from 'react'
import { Callout, Checkbox, Icon, IDropdownOption, Stack } from '@fluentui/react'
import { useBoolean, useId } from '@fluentui/react-hooks'
import { wrap } from '~utils/appinsights'
import { noop } from '~utils/noop'
import styles from './index.module.scss'
import { truncate } from 'lodash'

interface CustomOptionsFilterProps {
	filterLabel: string
	options: IDropdownOption[]
	placeholder?: string
	defaultSelectedKeys?: string[]
	onFilterChanged?: (option: IDropdownOption) => void
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

		const handleChange = function (ev?: React.FormEvent, isChecked?: boolean) {
			const _selected = [...selected]
			const option = options.find((option) => option.key === ev.target.name)

			if (isChecked) {
				_selected.push(option.key)
			} else {
				_selected.splice(_selected.indexOf(option.key), 1)
			}

			setSelected(_selected)
			onFilterChanged({ selected: isChecked, ...option })
		}

		const title = truncate(placeholder)
		const iconClassname = selected.length > 0 ? styles.iconActive : styles.icon

		return (
			<>
				<span id={buttonId} className={styles.header}>
					{title}
					<Icon className={iconClassname} iconName='FilterSolid' onClick={toggleShowCallout} />
				</span>
				{showCallout && (
					<Callout
						className={styles.callout}
						gapSpace={0}
						target={`#${buttonId}`}
						isBeakVisible={false}
						onDismiss={toggleShowCallout}
						directionalHint={4}
						setInitialFocus
					>
						<Stack tokens={{ childrenGap: 10 }} style={{ padding: '8px' }}>
							{options.map((option) => {
								return (
									<Checkbox
										defaultChecked={selected.includes(option.key)}
										key={option.key}
										label={option.text}
										name={option.key}
										onChange={handleChange}
									/>
								)
							})}
						</Stack>
					</Callout>
				)}
			</>
		)
	}
)
