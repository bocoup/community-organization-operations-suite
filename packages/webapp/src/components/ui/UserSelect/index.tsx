/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Field } from 'formik'
import React, { Component } from 'react'

import CreatableSelect from 'react-select/creatable'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
// import { colourOptions } from '../data'

const customStyles = {
	valueContainer: base => ({
		...base,
		paddingTop: '1px',
		paddingBottom: '1px'
	}),
	control: (base, state) => ({
		...base,
		border: state.isFocused ? '1px solid #0078d4' : '1px solid #979797',
		fontSize: '14px	',
		lineHeight: '21px',
		// This line disable the blue border
		boxShadow: 'none',
		minHeight: 35,

		// boxShadow: state.isFocused ? '0px 0px 1px #0078d4' : '0px 0px 1px #979797',
		'&:hover': {
			boxShadow: 'none',
			border: state.isFocused ? '0px 0px 1px #0078d4' : '0px 0px 1px #979797'
		}
	}),
	dropdownIndicator: base => ({
		...base,
		padding: 4
	})
	// : () => ({
	// 	// none of react-select's styles are passed to <Control />
	// 	border: '1px solid #979797 '
	// })
	// singleValue: (provided, state) => {
	// 	const opacity = state.isDisabled ? 0.5 : 1
	// 	const transition = 'opacity 300ms'

	// 	return { ...provided, opacity, transition }
	// }
}

interface UserSelectProps extends ComponentProps {
	name?: string
	placeholder?: string
	error?: string
}

export default function UserSelect({ name, placeholder }: UserSelectProps): JSX.Element {
	const handleChange = (newValue: any, actionMeta: any) => {
		console.group('Value Changed')
		console.log(newValue)
		console.log(`action: ${actionMeta.action}`)
		console.groupEnd()
	}

	const handleInputChange = (inputValue: any, actionMeta: any) => {
		console.group('Input Changed')
		console.log(inputValue)
		console.log(`action: ${actionMeta.action}`)
		console.groupEnd()
	}

	return (
		<Field name='lastName'>
			{({
				field, // { name, value, onChange, onBlur }
				form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
				meta
			}) => (
				<>
					{/* <input type='text' placeholder='Email' {...field} /> */}
					<CreatableSelect
						{...field}
						className={styles.userSelect}
						isClearable
						styles={customStyles}
						onChange={handleChange}
						onInputChange={handleInputChange}
						placeholder={placeholder}
						components={{
							IndicatorSeparator: () => null
						}}
					/>
					{meta.touched && meta.error && <div className='error'>{meta.error}</div>}
				</>
			)}
		</Field>
	)
}
