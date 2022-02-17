/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Field } from 'formik'
import { memo, useState } from 'react'
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
	const lastOption = options[options.length - 1]

	return (
		<Field name={name}>
			{({
				field, // { name, value, onChange, onBlur }
				form,
				meta
			}) => {
				const handleChange = (newValue: IChoiceGroupOption) => {
					// Propagate onChange event
					onChange(newValue.key)

					// Set Formik Field value
					form.setFieldValue(field.name, newValue.key)
				}

				const displayOtherField: boolean = customOptionInput && lastOption.key === form.values[name]

				return (
					<>
						<ChoiceGroup
							label={label}
							required={field.requirement === ServiceFieldRequirement.Required}
							options={options}
							defaultSelectedKey={form.values[name]}
							onChange={(e, option) => {
								handleChange(option)
							}}
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

						{displayOtherField && (
							<FormikField
								className='mt-3'
								name={`${name}Custom`}
								placeholder={customOptionPlaceholder}
								error={meta.touched ? meta.error : undefined}
								value={customOptionValue || form.values[`${name}Custom`]}
								onChange={(val) => {
									setCustomOptionValue(val.target.value)
									// Set Formik Field value
									form.setFieldValue(`${name}Custom`, val.target.value.trim())
								}}
								disabled={field.value !== lastOption.key || disabled}
							/>
						)}

						{meta.touched && meta.error && <div className='mt-2 text-danger'>{meta.error}</div>}
					</>
				)
			}}
		</Field>
	)
})
