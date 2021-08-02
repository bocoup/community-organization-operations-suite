/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ComponentProps from '~types/ComponentProps'
import { Collapse } from 'react-bootstrap'
import { memo, useState } from 'react'
import cx from 'classnames'

import styles from './index.module.scss'

interface CollapsibleProps extends ComponentProps {
	in?: boolean
}

const Collapsible = memo(function Collapsible({
	in: inProp,
	children,
	className
}: CollapsibleProps): JSX.Element {
	const [hasOpenClassName, setHasOpenClassName] = useState(false)

	return (
		<Collapse
			in={inProp}
			onEnter={() => setHasOpenClassName(true)}
			onExited={() => setHasOpenClassName(false)}
		>
			<div className={cx(hasOpenClassName ? styles.openCollapsible : '')}>{children}</div>
		</Collapse>
	)
})

export default Collapsible
