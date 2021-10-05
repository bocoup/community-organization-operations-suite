/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import { memo } from 'react'
import type { StandardFC } from '~types/StandardFC'

export const FormTitle: StandardFC = memo(function FormTitle({ className, children }) {
	return <h3 className={cx('mb-4', className)}>{children}</h3>
})
