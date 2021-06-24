/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import { memo } from 'react'
import type ComponentProps from '~types/ComponentProps'

type FormTitleProps = ComponentProps

const FormTitle = memo(function FormTitle({ className, children }: FormTitleProps): JSX.Element {
	return <h3 className={cx('mb-4', className)}>{children}</h3>
})
export default FormTitle
