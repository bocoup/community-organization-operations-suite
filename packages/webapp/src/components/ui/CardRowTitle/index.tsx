/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable react/no-children-prop */
import cx from 'classnames'
import { createElement, memo } from 'react'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { noop } from '~utils/noop'
import { classNames } from 'react-select/src/utils'

interface CardRowTitleProps {
	title?: string
	titleLink?: string
	tag?: string
	onClick?: () => void
}

export const CardRowTitle: StandardFC<CardRowTitleProps> = memo(function CardRowTitle({
	title,
	titleLink,
	tag = 'h4',
	onClick = noop,
	className,
	children, // ignored
	...props
}) {
	if (!title) {
		return null
	}
	if (titleLink) {
		return (
			<div className={cx(styles.link, className)} {...props} onClick={onClick}>
				{createElement(tag, { children: title })}
			</div>
		)
	} else {
		return createElement(tag, { ...props, children: title, className })
	}
})
