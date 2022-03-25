/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ReactNode } from 'react'
import { memo } from 'react'
import { Col } from 'react-bootstrap'
import cx from 'classnames'
import { Icon } from '@fluentui/react'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'

export const CollapsibleListTitle: StandardFC<{
	title: string
	collapsibleOpen: boolean
	collapsible: boolean
	onCollapse: () => void
	listLength: number
}> = memo(function ListTitle({
	title,
	collapsible,
	collapsibleOpen,
	onCollapse,
	listLength,
	className,
	id,
	style
}) {
	return (
		<Col
			md={3}
			xs={12}
			className={cx(collapsible ? styles.collapser : '', className)}
			onClick={onCollapse}
			id={id}
			style={style}
		>
			<div className={cx('d-flex align-items-center', collapsible ? styles.collapsibleHeader : '')}>
				{collapsible && (
					<Icon
						iconName='ChevronRight'
						className={cx(
							'collapser',
							styles.collapsibleIcon,
							collapsibleOpen ? styles.rotateChev : ''
						)}
					/>
				)}
				{!!title && (
					<h2 className='mb-3 list-title'>
						{title} ({listLength})
					</h2>
				)}
			</div>
		</Col>
	)
})

export const SimpleListTitle: StandardFC<{ title: ReactNode }> = memo(function SimpleListTitle({
	title,
	className,
	id,
	style
}) {
	return (
		<Col md={3} xs={12} className={cx('list-title', className)} id={id} style={style}>
			{title}
		</Col>
	)
})
