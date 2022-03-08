/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StandardFC } from '~types/StandardFC'
import { useEffect, useState } from 'react'
import { Callout, Checkbox, Icon, IDropdownOption } from '@fluentui/react'
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
	onTrackEvent: (name: string) => void
}

export const CustomOptionsFilter: StandardFC<CustomOptionsFilterProps> = wrap(
	function CustomOptionsFilter({
		filterLabel,
		placeholder,
		options,
		defaultSelectedKeys,
		onFilterChanged = noop,
		onTrackEvent = noop
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

			onTrackEvent('Filter Applied')
			setSelected(_selected)
			onFilterChanged({ selected: isChecked, ...option })
		}

		const title = truncate(placeholder)
		const iconClassname = selected.length > 0 ? styles.iconActive : styles.icon
		const checkboxes = options?.map((option) => {
			return (
				<Checkbox
					defaultChecked={selected.includes(option.key)}
					key={option.key}
					label={option.text}
					name={option.key.toString()}
					onChange={handleChange}
				/>
			)
		})

		return (
			<header id={buttonId} className={cx(SortingClassName, styles.header)}>
				{title}
				<Icon className={iconClassname} iconName='FilterSolid' onClick={toggleShowCallout} />
				{showCallout && (
					<Callout
						className={styles.callout}
						directionalHint={4}
						gapSpace={0}
						isBeakVisible={false}
						onDismiss={toggleShowCallout}
						setInitialFocus
						target={`#${buttonId}`}
					>
						{checkboxes}
					</Callout>
				)}
			</header>
		)
	}
)
