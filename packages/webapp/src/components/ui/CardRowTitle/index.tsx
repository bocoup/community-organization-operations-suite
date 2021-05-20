/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Link from 'next/link'
import { createElement } from 'react'
import cx from 'classnames'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'

interface CardRowTitleProps extends ComponentProps {
	title?: string
	titleLink?: string
	tag?: string
	onClick?: () => void
}

export default function CardRowTitle({
	title,
	titleLink,
	tag = 'h4',
	onClick
}: CardRowTitleProps): JSX.Element {
	return (
		<>
			{title && titleLink && (
				<div className={cx(styles.link)} onClick={() => onClick?.()}>
					{createElement(tag, { children: title })}
				</div>
			)}
			{title && !titleLink && createElement(tag, { children: title })}
		</>
	)
}
