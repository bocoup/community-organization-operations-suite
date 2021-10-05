/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ComponentProps } from '~types/ComponentProps'
import { Collapse } from 'react-bootstrap'
import { memo } from 'react'
import cx from 'classnames'

import styles from './index.module.scss'

interface CollapsibleProps extends ComponentProps {
	in?: boolean
	enabled?: boolean
}

export const Collapsible = memo(function Collapsible({
	in: inProp,
	children,
	enabled = true
}: CollapsibleProps): JSX.Element {
	return enabled ? (
		<Collapse in={inProp}>
			<div className={cx(styles.collapsible, inProp ? styles.open : '')}>{children}</div>
		</Collapse>
	) : (
		<>{children}</>
	)
})
