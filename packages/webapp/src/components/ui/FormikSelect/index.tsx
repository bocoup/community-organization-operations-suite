/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Field } from 'formik'
import Select from 'react-select'
import type ComponentProps from '~types/ComponentProps'

// React select users js object style notation :(
export const reactSelectStyles = {
	valueContainer: (base: Record<string, any>): Record<string, any> => ({
		...base,
		paddingTop: '1px',
		paddingBottom: '1px'
	}),
	control: (base: Record<string, any>, state: { isFocused: boolean }): Record<string, any> => ({
		...base,
		border: state.isFocused ? '1px solid #0078d4' : '1px solid #979797',
		fontSize: '14px	',
		lineHeight: '21px',
		minHeight: 36,
		// This line disables the blue border
		boxShadow: 'none',
		'&:hover': {
			boxShadow: 'none',
			border: state.isFocused ? '0px 0px 1px #0078d4' : '0px 0px 1px #979797'
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
	multiValue: (base: Record<string, any>): Record<string, any> => ({
		...base,
		borderRadius: '3rem',
		backgroundColor: '#373737', // Taken from designs. would put in bootstrap styles if react select accepted css styles :(
		color: '#FFFFFF',
		paddingLeft: '4px',
		paddingRight: '4px'
	}),
	multiValueLabel: (base: Record<string, any>): Record<string, any> => ({
		...base,
		color: '#FFFFFF'
	}),
	multiValueRemove: (base: Record<string, any>): Record<string, any> => ({
		...base,
		backgroundColor: '#FFFFFF', // Taken from designs. would put in bootstrap styles if react select accepted css styles :(
		color: '#373737',
		borderRadius: '100%',
		height: '18px',
		width: '18px',
		margin: 'auto'
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
	label: string
	value: string
	__isNew__?: boolean
}

export default function FormikSelect({
	name,
	placeholder,
	onChange,
	options,
	onInputChange,
	loadOptions,
	defaultValue,
	isMulti = false,
	...props
}: FormikSelectProps): JSX.Element {
	// }: FormikSelectProps & CommonProps<any, any>): JSX.Element {
	return (
		<Field name={name}>
			{({
				field, // { name, value, onChange, onBlur }
				form,
				meta
			}) => {
				const d = (newValue: OptionType | OptionType[]) => {
					onChange?.(newValue)

					form.setFieldValue(field.name, (newValue as OptionType)?.value)
				}

				return (
					<>
						{/* <input type='text' placeholder='Email' {...field} /> */}
						<Select
							{...field}
							isClearable
							styles={reactSelectStyles}
							onChange={d}
							placeholder={placeholder}
							defaultValue={defaultValue}
							options={options}
							cacheOptions
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
