/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FontIcon } from '@fluentui/react'
import cx from 'classnames'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'

interface MultiActionButtonProps extends ComponentProps {
	onClick?: () => void
}

export default function MultiActionButton({
	onClick,
	className
}: MultiActionButtonProps): JSX.Element {
	return (
		<>
			<button
				className={cx(
					'btn btn-primary d-flex justify-content-center align-items-center',
					styles.multiActionButton,
					className
				)}
				onClick={onClick}
			>
				<FontIcon iconName='MoreVertical' />
			</button>
		</>
	)
}
