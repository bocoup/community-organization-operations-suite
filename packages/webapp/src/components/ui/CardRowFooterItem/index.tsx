/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type { ComponentProps } from '~types/ComponentProps'
import { memo } from 'react'

interface CardRowFooterItemProps extends ComponentProps {
	title?: string
	body?: string | JSX.Element
}

export const CardRowFooterItem = memo(function CardRowFooterItem({
	title,
	body
}: CardRowFooterItemProps): JSX.Element {
	return (
		<div className={styles.cardRowFooterItem}>
			<span className='text-muted d-block'>{title}</span>
			{body}
		</div>
	)
})
