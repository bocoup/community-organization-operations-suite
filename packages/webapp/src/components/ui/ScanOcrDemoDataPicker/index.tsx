/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * Demo Code
 * Needs to be clean up in next sprint
 */
import { useRef, useState, useCallback, memo } from 'react'
import type { StandardFC } from '~types/StandardFC'
import type {
	IDatePicker} from '@fluentui/react';
import {
	DatePicker,
	mergeStyleSets,
	defaultDatePickerStrings,
	DefaultButton
} from '@fluentui/react'

const styles = mergeStyleSets({
	root: { selectors: { '> *': { marginBottom: 15 } } },
	control: { maxWidth: 300, marginBottom: 15 }
})

interface ScanOcrDemoDatePickerProps {
	label?: string
	inputValue?: Date
	onClose?: () => void
	isLoaded?: (loaded: boolean) => void
}

export const ScanOcrDemoDatePicker: StandardFC<ScanOcrDemoDatePickerProps> = memo(
	function ScanOcrDemoDatePicker({ label, inputValue }) {
		const [value, setValue] = useState<Date | undefined>(inputValue)
		const datePickerRef = useRef<IDatePicker>(null)

		const onClick = useCallback((): void => {
			setValue(undefined)
			datePickerRef.current?.focus()
		}, [])

		return (
			<div className={styles.root}>
				<DatePicker
					componentRef={datePickerRef}
					label={label}
					allowTextInput
					ariaLabel='Select a date'
					value={value}
					onSelectDate={setValue as (date: Date | null | undefined) => void}
					className={styles.control}
					strings={defaultDatePickerStrings}
				/>
				<DefaultButton aria-label='Clear the date input' onClick={onClick} text='Clear' />
			</div>
		)
	}
)
