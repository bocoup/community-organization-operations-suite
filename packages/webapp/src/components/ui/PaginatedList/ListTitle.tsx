/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { FC, memo, ReactNode } from 'react'
import { Col } from 'react-bootstrap'
import cx from 'classnames'
import { Icon } from '@fluentui/react'
import styles from './index.module.scss'

export const CollapsibleListTitle: FC<{
	title: string
	collapsibleOpen: boolean
	collapsible: boolean
	onCollapse: () => void
	listLength: number
}> = memo(function ListTitle({ title, collapsible, collapsibleOpen, onCollapse, listLength }) {
	return (
		<Col md={3} xs={12} className={cx(collapsible ? styles.collapser : '')} onClick={onCollapse}>
			<div className={cx('d-flex align-items-center', collapsible ? styles.collapsibleHeader : '')}>
				{collapsible && (
					<Icon
						iconName='ChevronRight'
						className={cx(styles.collapsibleIcon, collapsibleOpen ? styles.rotateChev : '')}
					/>
				)}
				{!!title && (
					<h2 className='mb-3'>
						{title} ({listLength})
					</h2>
				)}
			</div>
		</Col>
	)
})

export const SimpleListTitle: FC<{ title: ReactNode }> = memo(function SimpleListTitle({ title }) {
	return (
		<Col md={3} xs={12}>
			{title}
		</Col>
	)
})
