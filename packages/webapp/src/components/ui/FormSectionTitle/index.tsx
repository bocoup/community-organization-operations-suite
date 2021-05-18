/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import type ComponentProps from '~types/ComponentProps'

type FormSectionTitleProps = ComponentProps

export default function FormSectionTitle({
	className,
	children
}: FormSectionTitleProps): JSX.Element {
	return <h5 className={cx('mb-2', className)}>{children}</h5>
}
