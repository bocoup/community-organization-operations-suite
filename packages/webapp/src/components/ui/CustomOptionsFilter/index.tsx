/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StandardFC } from '~types/StandardFC'
import { useEffect, useState } from 'react'
import type { IDropdownOption } from '@fluentui/react'
import { Callout, Checkbox, Icon, Stack } from '@fluentui/react'
import { useBoolean, useId } from '@fluentui/react-hooks'
import { wrap } from '~utils/appinsights'
import { noop } from '~utils/noop'
import { SortingClassName } from '~utils/sorting'
import styles from './index.module.scss'
import { truncate } from 'lodash'
import cx from 'classnames'

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

		const handleChange = function (
			event?: React.FormEvent<HTMLElement | HTMLInputElement>,
			isChecked?: boolean
		) {
			const _selected = [...selected]

			const input = event.target as HTMLInputElement
			const option = options.find((option) => option.key.toString() === input.name)

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
				<span id={buttonId} className={cx(SortingClassName, styles.header)}>
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
										name={option.key.toString()}
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
