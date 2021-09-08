/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Field } from 'formik'
import { memo, useState } from 'react'
import type ComponentProps from '~types/ComponentProps'
import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react'
import FormikField from '~ui/FormikField'

// React select users js object style notation :(
export const reactSelectStyles = {
	valueContainer: (base: Record<string, any>): Record<string, any> => ({
		...base,
		paddingTop: '1px',
		paddingBottom: '1px'
	}),
	control: (base: Record<string, any>, state: { isFocused: boolean }): Record<string, any> => ({
		...base,
		border: state.isFocused ? '1px solid var(--bs-primary)' : '1px solid var(--bs-gray-4)',
		fontSize: '14px	',
		lineHeight: '21px',
		minHeight: 36,
		// This line disables the blue border
		boxShadow: 'none',
		'&:hover': {
			boxShadow: 'none',
			border: '1px solid var(--bs-primary)'
		}
	}),
	clearIndicator: (base: Record<string, any>): Record<string, any> => ({
		...base,
		padding: 4
	}),
	indicatorContainer: (base: Record<string, any>): Record<string, any> => ({
		...base,
		padding: 4
	}),
	dropdownIndicator: (base: Record<string, any>): Record<string, any> => ({
		...base,
		padding: 4
	}),
	menu: (base: Record<string, any>): Record<string, any> => ({
		...base,
		borderRadius: 0,
		padding: 0
	}),
	menuList: (base: Record<string, any>): Record<string, any> => ({
		...base,
		paddingTop: 0,
		paddingBottom: 0
	}),
	multiValue: (base: Record<string, any>): Record<string, any> => ({
		...base,
		borderRadius: '3rem',
		backgroundColor: 'var(--bs-dark)', // Taken from designs. would put in bootstrap styles if react select accepted css styles :(
		color: 'var(--bs-white)',
		paddingLeft: '4px',
		paddingRight: '4px'
	}),
	multiValueLabel: (base: Record<string, any>): Record<string, any> => ({
		...base,
		color: 'var(--bs-white)'
	}),
	multiValueRemove: (base: Record<string, any>): Record<string, any> => ({
		...base,
		backgroundColor: 'var(--bs-white)', // Taken from designs. would put in bootstrap styles if react select accepted css styles :(
		color: 'var(--bs-dark)',
		borderRadius: '100%',
		height: '18px',
		width: '18px',
		margin: 'auto'
	}),
	placeholder: (base: Record<string, any>): Record<string, any> => ({
		...base,
		color: 'var(--bs-text-muted)'
	})
}

export interface FormikSelectProps extends ComponentProps {
	name?: string
	placeholder?: string
	error?: string
	options?: Record<string, any>[]
	defaultValue?: {
		value: any
		label: string
	}
	onChange?: (any) => void
	onInputChange?: (any) => void
	loadOptions?: (inputValue: string, callback: () => void) => void
	isMulti?: boolean
}

export interface OptionType {
	text: string
	value: string
}

export interface FormikRaioGroupProps {
	name?: string
	onChange?: (value: string) => void
	options?: IChoiceGroupOption[]
	label?: string
	customOptionInput?: boolean
	customOptionPlaceholder?: string
}

const FormikRaioGroup = memo(function FormikRadioGroup({
	name,
	onChange,
	options,
	label,
	customOptionInput,
	customOptionPlaceholder
}: FormikRaioGroupProps): JSX.Element {
	const [customOptionValue, setCustomOptionValue] = useState('')
	const lastOption = options[options.length - 1]
	return (
		<Field name={name}>
			{({
				field, // { name, value, onChange, onBlur }
				form,
				meta
			}) => {
				const handleChange = (newValue: IChoiceGroupOption) => {
					// Reset custom option value if user selects another option
					if (customOptionInput && newValue.key !== lastOption.key) setCustomOptionValue('')

					// Propigate onChange event
					onChange?.(newValue.key)

					// Set Formik Field value
					form.setFieldValue(field.name, newValue.key)
				}

				return (
					<>
						<ChoiceGroup
							label={label}
							required={field.fieldRequirements === 'required'}
							options={options}
							onChange={(e, option) => {
								handleChange(option)
							}}
							styles={{
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
							}}
						/>

						{customOptionInput && (
							<FormikField
								className='mt-3'
								name={`${name}Custom`}
								placeholder={customOptionPlaceholder}
								error={meta.touched ? meta.error : undefined}
								value={customOptionValue}
								onChange={(val) => {
									setCustomOptionValue(val.target.value)
									// Set Formik Field value
									form.setFieldValue(`${name}Custom`, val.target.value.trim())
								}}
								disabled={field.value !== lastOption.key}
							/>
						)}

						{meta.touched && meta.error && <div className='mt-2 text-danger'>{meta.error}</div>}
					</>
				)
			}}
		</Field>
	)
})

export default FormikRaioGroup
