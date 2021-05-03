/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ComponentProps from '~types/ComponentProps'
import styles from './index.module.scss'

interface CardRowFooterItemProps extends ComponentProps {
	title?: string
	body?: string | JSX.Element
}

export default function CardRowFooterItem({ title, body }: CardRowFooterItemProps): JSX.Element {
	return (
		<div className={styles.cardRowFooterItem}>
			<span className='text-muted d-block'>{title}</span>
			{body}
		</div>
	)
}
