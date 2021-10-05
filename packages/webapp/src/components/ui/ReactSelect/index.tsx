/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import Select from 'react-select'
import type { ComponentProps } from '~types/ComponentProps'

// React select without Formik
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

export interface OptionType {
	label: string
	value: any
}
export interface ReactSelectProps extends ComponentProps {
	name?: string
	placeholder?: string
	error?: string
	options?: any[]
	defaultValue?: any
	defaultInputValue?: string
	onChange?: (filterOption: OptionType) => void
	isMulti?: boolean
}

export const ReactSelect = memo(function ReactSelect({
	onChange,
	placeholder,
	defaultValue,
	defaultInputValue,
	isMulti,
	options
}: ReactSelectProps): JSX.Element {
	return (
		<>
			<Select
				isClearable
				styles={reactSelectStyles}
				onChange={onChange}
				options={options}
				placeholder={placeholder}
				defaultValue={defaultValue}
				defaultInputValue={defaultInputValue}
				isMulti={isMulti}
				components={{
					IndicatorSeparator: () => null
				}}
			/>
		</>
	)
})
