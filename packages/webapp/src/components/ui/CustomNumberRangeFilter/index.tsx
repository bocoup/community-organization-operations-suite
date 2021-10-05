/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState } from 'react'
import styles from './index.module.scss'
import type { ComponentProps } from '~types/ComponentProps'
import { wrap } from '~utils/appinsights'
import { Callout, ActionButton, TextField, ITextFieldStyles, IButtonStyles } from '@fluentui/react'
import { Icon } from '~ui/Icon'
import cx from 'classnames'
import { useBoolean, useId } from '@fluentui/react-hooks'
import { useTranslation } from '~hooks/useTranslation'

interface CustomNumberRangeFilterProps extends ComponentProps {
	filterLabel?: string
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

const CustomNumberRangeFilter = memo(function CustomNumberRangeFilter({
	filterLabel,
	minValue,
	maxValue,
	onFilterChanged
}: CustomNumberRangeFilterProps): JSX.Element {
	const { t } = useTranslation(['reporting'])
	const buttonId = useId('filter-callout-button')
	const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(false)
	const [min, setMin] = useState(minValue || 0)
	const [max, setMax] = useState(maxValue || 0)

	return (
		<>
			<button
				id={buttonId}
				className={styles.customFilterButton}
				onClick={() => toggleIsCalloutVisible()}
			>
				<span>{filterLabel}</span>
				<Icon iconName='FilterSolid' className={cx(styles.buttonIcon)} />
			</button>
			{isCalloutVisible ? (
				<Callout
					className={styles.callout}
					gapSpace={0}
					target={`#${buttonId}`}
					isBeakVisible={false}
					onDismiss={() => toggleIsCalloutVisible()}
					directionalHint={4}
					setInitialFocus
				>
					<div className={styles.numberRangeFilter}>
						<TextField
							label={t('customFilters.min')}
							placeholder={min.toString()}
							value={min.toString()}
							styles={filterTextStyles}
							onChange={(event, value) => {
								setMin(Number(value))
								onFilterChanged?.(Number(value), max)
							}}
						/>
						<TextField
							label={t('customFilters.max')}
							placeholder={max.toString()}
							value={max.toString()}
							styles={filterTextStyles}
							onChange={(event, value) => {
								setMax(Number(value))
								onFilterChanged?.(min, Number(value))
							}}
						/>
						<ActionButton
							iconProps={{ iconName: 'Clear' }}
							styles={actionButtonStyles}
							onClick={() => {
								setMin(minValue)
								setMax(maxValue)
								onFilterChanged?.(minValue, maxValue)
							}}
						>
							{t('customFilters.clearFilter')}
						</ActionButton>
					</div>
				</Callout>
			) : null}
		</>
	)
})
export default wrap(CustomNumberRangeFilter)
