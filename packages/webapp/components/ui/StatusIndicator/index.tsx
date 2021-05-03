/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import type ComponentProps from '~types/ComponentProps'
import style from './index.module.scss'

interface StatusIndicatorProps extends ComponentProps {
	status: 'open' | 'busy' | 'closed'
}

export default function StatusIndicator({ status }: StatusIndicatorProps): JSX.Element {
	const colorStyle =
		status === 'open' ? 'bg-success' : status === 'busy' ? 'bg-warning' : 'bg-danger'

	return <div className={cx(style.statusIndicator, colorStyle, 'me-2')} />
}
