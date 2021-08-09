/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Icon from '~ui/Icon'
import cx from 'classnames'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { memo } from 'react'

interface MultiActionButtonProps extends ComponentProps {
	onClick?: () => void
}

const MultiActionButton = memo(function MultiActionButton({
	onClick,
	className
}: MultiActionButtonProps): JSX.Element {
	return (
		<>
			<button
				className={cx(
					'btn btn-primary-light d-flex justify-content-center align-items-center',
					styles.multiActionButton,
					className
				)}
				onClick={onClick}
			>
				<Icon iconName='MoreVertical' />
			</button>
		</>
	)
})
export default MultiActionButton
