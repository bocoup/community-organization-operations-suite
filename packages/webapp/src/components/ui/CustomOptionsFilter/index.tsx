/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StandardFC } from '~types/StandardFC'
import { useEffect, useState } from 'react'
import { ActionButton, Callout, Checkbox, Icon } from '@fluentui/react'
import { useBoolean, useId } from '@fluentui/react-hooks'
import { wrap } from '~utils/appinsights'
import { noop } from '~utils/noop'
import { SortingClassName } from '~utils/sorting'
import styles from './index.module.scss'
import { truncate } from 'lodash'
import cx from 'classnames'
import { Namespace, useTranslation } from '~hooks/useTranslation'

type CustomOption = {
	key: string
	text: string
}

interface CustomOptionsFilterProps {
	filterLabel?: string
	options: CustomOption[]
	placeholder?: string
	defaultSelectedKeys?: string[]
	onFilterChanged?: (selection: string[]) => void
	onTrackEvent?: (name: string) => void
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
		const { t } = useTranslation(Namespace.Reporting)
		const buttonId = useId('filter-callout-button')
		const [showCallout, { toggle: toggleShowCallout }] = useBoolean(false)
		const [selected, setSelected] = useState<string[]>([])

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
			onFilterChanged(_selected)
		}

		const handleClearAll = function () {
			setSelected([])
			onFilterChanged([])
		}

		const title = truncate(placeholder)
		const iconClassname = selected.length > 0 ? styles.iconActive : styles.icon

		const checkboxes = options?.map((option) => {
			return (
				<Checkbox
					checked={selected.includes(option.key)}
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
						<ActionButton
							className={styles.clearFilter}
							iconProps={{ iconName: 'Clear' }}
							onClick={handleClearAll}
						>
							{t('customFilters.clearFilter')}
						</ActionButton>
					</Callout>
				)}
			</header>
		)
	}
)
