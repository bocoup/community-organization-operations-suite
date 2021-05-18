/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { Field, FieldProps } from 'formik'

// This props list is not all inclusive and should be added to as props from formiks input field are needed
// https://formik.org/docs/api/field
interface FormikFieldProps extends ComponentProps {
	title?: string
	name: string
	placeholder?: string
	as?: string
}

/**
 * Styled wrapper around FormikInputField
 * @param param0
 * @returns
 */
export default function FormikField(props: FormikFieldProps): JSX.Element {
	return <Field name='color' className={styles.formikField} {...props} />
}
