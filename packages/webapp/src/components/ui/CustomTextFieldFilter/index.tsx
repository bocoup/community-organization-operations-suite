/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useState } from 'react'
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

interface CustomTextFieldFilterProps {
	filterLabel?: string
	onFilterChanged?: (value: string) => void
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

export const CustomTextFieldFilter: StandardFC<CustomTextFieldFilterProps> = wrap(
	function CustomTextFieldFilter({ filterLabel, onFilterChanged = noop }) {
		const { t } = useTranslation(Namespace.Reporting)
		const buttonId = useId('filter-callout-button')
		const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(false)
		const [filterValue, setFilterValue] = useState<string>('')

		return (
			<>
				<button
					id={buttonId}
					className={styles.customFilterButton}
					onClick={toggleIsCalloutVisible}
				>
					<span>{filterLabel}</span>
					<Icon
						iconName='FilterSolid'
						className={cx(styles.buttonIcon, filterValue ? styles.buttonIconActive : null)}
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
						<div className={styles.textFieldFilter}>
							<TextField
								placeholder={t('customFilters.typeHere')}
								value={filterValue}
								styles={filterTextStyles}
								onChange={(event, value) => {
									setFilterValue(value || '')
									onFilterChanged(value || '')
								}}
							/>
							<ActionButton
								iconProps={{ iconName: 'Clear' }}
								styles={actionButtonStyles}
								onClick={() => {
									setFilterValue('')
									onFilterChanged('')
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
