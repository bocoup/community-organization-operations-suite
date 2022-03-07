/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { FieldProps } from 'formik'
import { Field } from 'formik'
import type { FormBuilderProps, IFormBuilderFieldProps } from '~components/ui/FormBuilderField'
import { memo, useState, useEffect } from 'react'
import type { IChoiceGroupOption, IChoiceGroupStyles } from '@fluentui/react'
import { ChoiceGroup } from '@fluentui/react'
import { FormikField } from '~ui/FormikField'
import { ServiceFieldRequirement } from '@cbosuite/schema/dist/client-types'

interface FormikRadioGroupProps {
	name?: string
	options?: IChoiceGroupOption[]
	label?: string
	customOptionInput?: boolean
	disabled?: boolean
	customOptionPlaceholder?: string
}

export const FormikRadioGroup = memo(function FormikRadioGroup(
	props: FormikRadioGroupProps
): JSX.Element {
	return (
		<Field
			component={CustomInputComponent}
			customOptionInput={props.customOptionInput}
			customOptionPlaceholder={props.customOptionPlaceholder}
			disabled={props.disabled}
			label={props.label}
			name={props.name}
			options={props.options}
		/>
	)
})

interface CustomInputField extends IFormBuilderFieldProps {
	name?: string
	value?: string
	onBlur?: (value: string) => void
	onChange?: (value: string) => void
}
interface CustomInputProps
	extends FormikRadioGroupProps,
		Omit<FormBuilderProps, 'field'>,
		Omit<FieldProps, 'field'> {
	field?: CustomInputField
}

/**
 * Create the Custom input that displays both:
 * 		- FluentUI button group
 * 		- FormikFiled input
 *
 * This is meant to encapsulate some specific behaviours
 */
const CustomInputComponent: React.ComponentType<CustomInputProps> = function (props) {
	const { customOptionInput, customOptionPlaceholder, disabled, field, form, label, options } =
		props

	const name = field.name
	const [customOptionValue, setCustomOptionValue] = useState<string>('')
	const [selectedOption, setSelectedOption] = useState<string>(null)
	const otherOptionKey = customOptionInput ? options?.find((o) => o.key === 'other')?.key : null

	// Set the selected option on mount
	useEffect(() => {
		if (!selectedOption && customOptionInput) {
			// Check if the field value is one of the options
			if (options.some((o) => o.key === form.values[name])) {
				setSelectedOption(form.values[name])
			}

			// Otherwise, if the field is non null, set to Other
			else if (field.value !== '') {
				setSelectedOption(otherOptionKey)
			}
		}

		if (!customOptionValue && !!form.values[`${name}Custom`]) {
			setCustomOptionValue(form.values[`${name}Custom`])
		}
	}, [
		// Hook dependencies
		customOptionInput,
		customOptionValue,
		field.value,
		form.values,
		name,
		options,
		otherOptionKey,
		selectedOption
	])

	const handleOptionsChange = (optionKey: string) => {
		// Clear the option input if not selected
		if (optionKey !== otherOptionKey) {
			changeOptionInput()
		}

		// Select the right option
		setSelectedOption(optionKey)

		// Set Formik Field value
		form.setFieldValue(name, optionKey)
	}

	const changeOptionInput = (value = '') => {
		const cleanValue = value?.trim() ?? ''
		setCustomOptionValue(cleanValue)
		form.setFieldValue(`${name}Custom`, cleanValue)
	}

	const isError: boolean = !!form?.touched && !!form?.errors?.[name]

	return (
		<>
			<ChoiceGroup
				disabled={disabled}
				label={label}
				onChange={(e, option) => handleOptionsChange(option.key)}
				options={options}
				required={field.requirement === ServiceFieldRequirement.Required}
				selectedKey={selectedOption}
				styles={choiceGroupStyleOptions}
			/>

			{customOptionInput && (
				<FormikField
					autoComplete='off'
					className='mt-3'
					disabled={disabled}
					name={`${name}Custom`}
					onChange={(e) => changeOptionInput(e.target.value)}
					onFocus={(e) => handleOptionsChange(otherOptionKey)}
					placeholder={customOptionPlaceholder}
					value={customOptionValue}
				/>
			)}

			{isError && <div className='mt-2 text-danger'>{form?.errors?.[name]}</div>}
		</>
	)
}

// See https://developer.microsoft.com/en-us/fluentui#/controls/web/choicegroup#IChoiceGroupStyles
const choiceGroupStyleOptions: IChoiceGroupStyles = {
	root: {
		selectors: {
			'.ms-ChoiceField-field': {
				':before': {
					borderColor: 'var(--bs-gray-4)'
				}
			}
		}
	},
	label: {
		':after': {
			color: 'var(--bs-danger)'
		}
	}
}
