/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import { memo } from 'react'
import type { StandardFC } from '~types/StandardFC'

export const FormSectionTitle: StandardFC = memo(function FormSectionTitle({
	className,
	children
}) {
	return <h5 className={cx('mb-2', className)}>{children}</h5>
})
