/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Field } from 'formik'
import { memo, useState /*, useEffect */ } from 'react'
import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react'
import { FormikField } from '~ui/FormikField'
import { noop } from '~utils/noop'
import { ServiceFieldRequirement } from '@cbosuite/schema/dist/client-types'

export interface FormikRaioGroupProps {
	name?: string
	onChange?: (value: string) => void
	options?: IChoiceGroupOption[]
	label?: string
	customOptionInput?: boolean
	disabled?: boolean
	customOptionPlaceholder?: string
}

export const FormikRadioGroup = memo(function FormikRadioGroup({
	name,
	onChange = noop,
	options,
	label,
	customOptionInput,
	disabled,
	customOptionPlaceholder
}: FormikRaioGroupProps): JSX.Element {
	const [customOptionValue, setCustomOptionValue] = useState<string | undefined>()
	const [selectedOption, setSelectedOption] = useState<string>(null)
	const otherOptionKey = customOptionInput
		? options?.find((option) => option.key === 'other')?.key
		: null

	return (
		<Field name={name}>
			{({ field, form, meta }) => {
				/*
				// Set the selected option on mount
				useEffect(() => {
					if (!selectedOption && customOptionInput) {
						// Check if the field value is one of the options
						if (options.some(o => o.key === field.value)) {
							setSelectedOption(field.value)
						}
						
						// Otherwise, if the field is non null, set to Other
						else if (field.value !== "") {
							setSelectedOption(otherOptionKey)
						}
					}
				})
				*/

				const handleOptionsChange = (optionKey: string) => {
					// Clear the option input if not selected
					if (optionKey !== otherOptionKey) {
						changeOptionInput()
					}

					// Select the right option
					setSelectedOption(optionKey)

					// Propagate onChange event
					onChange(optionKey)

					// Set Formik Field value
					form.setFieldValue(field.name, optionKey)
				}

				const changeOptionInput = (value = '') => {
					const cleanValue = value?.trim() ?? ''
					setCustomOptionValue(cleanValue)
					form.setFieldValue(`${name}Custom`, cleanValue)
				}

				return (
					<>
						<ChoiceGroup
							label={label}
							required={field.requirement === ServiceFieldRequirement.Required}
							options={options}
							onChange={(e, option) => handleOptionsChange(option.key)}
							selectedKey={selectedOption ?? field.value}
							disabled={disabled}
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
								autoComplete='off'
								className='mt-3'
								name={`${name}Custom`}
								placeholder={customOptionPlaceholder}
								error={meta.touched ? meta.error : undefined}
								value={customOptionValue || form.values[`${name}Custom`]}
								onChange={(e) => changeOptionInput(e.target.value)}
								onFocus={(e) => handleOptionsChange(otherOptionKey)}
								disabled={disabled}
							/>
						)}

						{meta.touched && meta.error && <div className='mt-2 text-danger'>{meta.error}</div>}
					</>
				)
			}}
		</Field>
	)
})
