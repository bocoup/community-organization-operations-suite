/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Field } from 'formik'
import { memo } from 'react'
import AsyncSelect, { AsyncProps } from 'react-select/async'
import type { StandardFC } from '~types/StandardFC'
import { reactSelectStyles } from '~ui/FormikSelect'
import cx from 'classnames'
import { noop } from '~utils/noop'

export interface FormikAsyncSelectProps {
	name?: string
	placeholder?: string
	error?: string
	errorClassName?: string
	defaultOptions?: Record<string, any>[]
	onChange?: (arg: any, type: string) => void
	onInputChange?: (any) => void
	loadOptions?: (inputValue: string, callback: () => void) => void
	isMulti?: boolean
	disabled?: boolean
}

export interface OptionType {
	label: string
	value: string
	__isNew__?: boolean
}

export const FormikAsyncSelect: StandardFC<FormikAsyncSelectProps & AsyncProps<any>> = memo(
	function FormikAsyncSelect({
		name,
		placeholder,
		onChange = noop,
		defaultOptions,
		onInputChange = noop,
		loadOptions,
		isMulti = false,
		disabled,
		errorClassName
	}) {
		return (
			<Field name={name}>
				{({
					field, // { name, value, onChange, onBlur }
					form,
					meta
				}) => {
					const handleChange = (newValue: OptionType | OptionType[], type: string) => {
						onChange(newValue, type)

						form.setFieldValue(
							field.name,
							isMulti ? (newValue as OptionType[]) : (newValue as OptionType)
						)
					}

					const handleInputChange = (inputValue: string) => {
						onInputChange(inputValue)
					}

					return (
						<>
							<AsyncSelect
								{...field}
								isClearable
								isMulti={isMulti}
								isDisabled={disabled}
								styles={reactSelectStyles}
								onChange={handleChange}
								onInputChange={handleInputChange}
								placeholder={placeholder}
								defaultOptions={defaultOptions}
								cacheOptions
								loadOptions={loadOptions}
								value={field?.value}
								components={{
									IndicatorSeparator: () => null
								}}
							/>
							{meta.touched && meta.error && (
								<div className={cx('mt-2 text-danger', errorClassName)}>{meta.error}</div>
							)}
						</>
					)
				}}
			</Field>
		)
	}
)
