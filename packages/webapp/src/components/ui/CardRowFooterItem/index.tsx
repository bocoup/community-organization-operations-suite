/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { memo } from 'react'

interface CardRowFooterItemProps {
	title?: string
	body?: string | JSX.Element
}

export const CardRowFooterItem: StandardFC<CardRowFooterItemProps> = memo(
	function CardRowFooterItem({ title, body }) {
		return (
			<div className={styles.cardRowFooterItem}>
				<span className='text-muted d-block'>{title}</span>
				{body}
			</div>
		)
	}
)
