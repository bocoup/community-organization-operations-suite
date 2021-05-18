/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import cx from 'classnames'

interface FormTitleProps extends ComponentProps {}

export default function FormTitle({ className, children }: FormTitleProps): JSX.Element {
	return <h3 className={cx('mb-4', className)}>{children}</h3>
}
