/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect, useState } from 'react'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { wrap } from '~utils/appinsights'
import {
	Callout,
	ActionButton,
	TextField,
	ITextFieldStyles,
	IButtonStyles,
	Icon
} from '@fluentui/react'

import cx from 'classnames'
import { useBoolean, useId } from '@fluentui/react-hooks'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { noop } from '~utils/noop'

interface CustomNumberRangeFilterProps {
	filterLabel?: string
	defaultValues?: Array<string | number>
	minValue?: number
	maxValue?: number
	onFilterChanged?: (min: number, max: number) => void
}

const filterTextStyles: Partial<ITextFieldStyles> = {
	field: {
		fontSize: 12,
		'::placeholder': {
			fontSize: 12,
			color: 'var(--bs-text-muted)'
		}
	},
	fieldGroup: {
		borderColor: 'var(--bs-gray-4)',
		borderRadius: 4,
		':hover': {
			borderColor: 'var(--bs-primary)'
		},
		':after': {
			borderRadius: 4,
			borderWidth: 1
		}
	}
}

const actionButtonStyles: Partial<IButtonStyles> = {
	textContainer: {
		fontSize: 12
	},
	icon: {
		fontSize: 12
	}
}

export const CustomNumberRangeFilter: StandardFC<CustomNumberRangeFilterProps> = wrap(
	function CustomNumberRangeFilter({
		filterLabel,
		minValue,
		maxValue,
		onFilterChanged = noop,
		defaultValues
	}) {
		const { t } = useTranslation(Namespace.Reporting)
		const buttonId = useId('filter-callout-button')
		const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(false)
		const [min, setMin] = useState(minValue || null)
		const [max, setMax] = useState(maxValue || null)

		useEffect(() => {
			const [_min, _max] = defaultValues || []
			if (_min) {
				setMin(parseFloat(_min.toString()))
			}
			if (_max) {
				setMax(parseFloat(_max.toString()))
			}
		}, [defaultValues, setMin, setMax])

		return (
			<>
				<button
					id={buttonId}
					className={styles.customFilterButton}
					title={filterLabel.length > 30 ? filterLabel : ''}
				>
					<span>
						{filterLabel.length > 30 ? filterLabel.substring(0, 30) + '...' : filterLabel}
					</span>
					<Icon
						onClick={toggleIsCalloutVisible}
						iconName='FilterSolid'
						className={cx(styles.buttonIcon, min || max ? styles.buttonIconActive : null)}
					/>
				</button>
				{isCalloutVisible ? (
					<Callout
						className={styles.callout}
						gapSpace={0}
						target={`#${buttonId}`}
						isBeakVisible={false}
						onDismiss={toggleIsCalloutVisible}
						directionalHint={4}
						setInitialFocus
					>
						<div className={styles.numberRangeFilter}>
							<TextField
								label={t('customFilters.min')}
								placeholder={min?.toString()}
								value={min?.toString()}
								styles={filterTextStyles}
								onChange={(event, value) => {
									setMin(Number(value))
									onFilterChanged(Number(value), max)
								}}
							/>
							<TextField
								label={t('customFilters.max')}
								placeholder={max?.toString()}
								value={max?.toString()}
								styles={filterTextStyles}
								onChange={(event, value) => {
									setMax(Number(value))
									onFilterChanged(min, Number(value))
								}}
							/>
							<ActionButton
								iconProps={{ iconName: 'Clear' }}
								styles={actionButtonStyles}
								onClick={() => {
									setMin(minValue)
									setMax(maxValue)
									onFilterChanged(minValue, maxValue)
								}}
							>
								{t('customFilters.clearFilter')}
							</ActionButton>
						</div>
					</Callout>
				) : null}
			</>
		)
	}
)
