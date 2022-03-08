/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect, useMemo, useState } from 'react'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { wrap, trackEvent } from '~utils/appinsights'
import { Callout, ActionButton, TextField, Icon } from '@fluentui/react'
import cx from 'classnames'
import { useBoolean, useId } from '@fluentui/react-hooks'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { noop } from '~utils/noop'
import { debounce, truncate } from 'lodash'
import { SortingClassName } from '~utils/sorting'

interface CustomTextFieldFilterProps {
	filterLabel?: string
	defaultValue?: string
	onFilterChanged?: (value: string) => void
}

export const CustomTextFieldFilter: StandardFC<CustomTextFieldFilterProps> = wrap(
	function CustomTextFieldFilter({ filterLabel, onFilterChanged = noop, defaultValue = '' }) {
		const { t } = useTranslation(Namespace.Reporting)
		const buttonId = useId('filter-callout-button')
		const [isCalloutVisible, { toggle: toggleShowCallout }] = useBoolean(false)
		const [filterValue, setFilterValue] = useState<string>('')

		useEffect(() => {
			if (defaultValue) setFilterValue(defaultValue)
		}, [defaultValue, setFilterValue])

		// Send the relevant Telemetry on filtering
		const sendTrackEvent = (value?: string) => {
			trackEvent({
				name: 'Filter Applied',
				properties: {
					'Organization ID': 'test organization id',
					'Data Category': 'test data category'
				}
			})
		}

		// Debounce to not send an event at each character change
		// https://dmitripavlutin.com/react-throttle-debounce/
		const debouncedTrackEvent = useMemo(() => debounce(sendTrackEvent, 1000), [])

		const handleFilterChange = (event?: React.FormEvent, value?: string) => {
			let sentValue = ''

			if (!!value) {
				sentValue = value.toString()
				debouncedTrackEvent(sentValue)
			}

			setFilterValue(sentValue)
			onFilterChanged(sentValue)
		}

		const handleClearFilter = () => {
			handleFilterChange()
			toggleShowCallout()
		}

		const title = truncate(filterLabel)
		const iconClassname = filterValue ? styles.iconActive : styles.icon

		return (
			<header id={buttonId} className={cx(SortingClassName, styles.header)}>
				{title}
				<Icon className={iconClassname} iconName='FilterSolid' onClick={toggleShowCallout} />
				{isCalloutVisible && (
					<Callout
						className={styles.callout}
						gapSpace={0}
						target={`#${buttonId}`}
						isBeakVisible={false}
						onDismiss={toggleShowCallout}
						directionalHint={4}
						setInitialFocus
					>
						<TextField
							onChange={handleFilterChange}
							placeholder={t('customFilters.typeHere')}
							value={filterValue}
						/>
						<ActionButton iconProps={{ iconName: 'Clear' }} onClick={handleClearFilter}>
							{t('customFilters.clearFilter')}
						</ActionButton>
					</Callout>
				)}
			</header>
		)
	}
)
