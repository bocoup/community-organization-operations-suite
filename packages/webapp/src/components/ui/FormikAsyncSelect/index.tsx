/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Field } from 'formik'
import AsyncSelect, { AsyncProps } from 'react-select/async'
import type ComponentProps from '~types/ComponentProps'
import { reactSelectStyles } from '~ui/FormikSelect'

export interface FormikAsyncSelectProps extends ComponentProps {
	name?: string
	placeholder?: string
	error?: string
	defaultOptions?: Record<string, any>[]
	onChange?: (arg: any, type: string) => void
	onInputChange?: (any) => void
	loadOptions?: (inputValue: string, callback: () => void) => void
	isMulti?: boolean
}

export interface OptionType {
	label: string
	value: string
	__isNew__?: boolean
}

export default function FormikAsyncSelect({
	name,
	placeholder,
	onChange,
	defaultOptions,
	onInputChange,
	loadOptions,
	isMulti = false,
	...props
}: FormikAsyncSelectProps & AsyncProps<any>): JSX.Element {
	return (
		<Field name={name}>
			{({
				field, // { name, value, onChange, onBlur }
				form,
				meta
			}) => {
				const handleChange = (newValue: OptionType | OptionType[], type: string) => {
					onChange?.(newValue, type)

					form.setFieldValue(
						field.name,
						isMulti
							? (newValue as OptionType[])?.map?.(val => val.value)
							: (newValue as OptionType)?.value
					)
				}

				const handleInputChange = (inputValue: string) => {
					onInputChange?.(inputValue)
				}

				return (
					<>
						<AsyncSelect
							{...field}
							isClearable
							isMulti={isMulti}
							styles={reactSelectStyles}
							onChange={handleChange}
							onInputChange={handleInputChange}
							placeholder={placeholder}
							defaultOptions={defaultOptions}
							cacheOptions
							loadOptions={loadOptions}
							label={field?.value?.label}
							value={field?.value?.value}
							components={{
								IndicatorSeparator: () => null
							}}
						/>
						{meta.touched && meta.error && <div className='mt-2 text-danger'>{meta.error}</div>}
					</>
				)
			}}
		</Field>
	)
}
