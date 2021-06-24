/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import { Field } from 'formik'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { memo } from 'react'

// This props list is not all inclusive and should be added to as props from formiks input field are needed
// https://formik.org/docs/api/field
interface FormikFieldProps extends ComponentProps {
	title?: string
	name: string
	placeholder?: string
	as?: string
	error?: string
	errorClassName?: string
	type?: string
	value?: string
}

/**
 * Styled wrapper around FormikInputField
 * @param param0
 * @returns
 */
const FormikField = memo(function FormikField({
	className,
	error,
	errorClassName,
	...props
}: FormikFieldProps): JSX.Element {
	return (
		<>
			<Field name='color' className={cx(styles.formikField, className)} {...props} />

			{/* Handle errors */}
			{error ? <div className={cx('pt-2 text-danger', errorClassName)}>{error}</div> : null}
		</>
	)
})
export default FormikField
