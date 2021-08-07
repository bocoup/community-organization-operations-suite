/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Icon from '~ui/Icon'
import cx from 'classnames'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { memo } from 'react'

export interface IMultiActionButtons<T> {
	name: string
	iconOnly?: boolean
	className?: string
	iconNameLeft?: string
	iconNameRight?: string
	isHidden?: boolean
	onActionClick?: (columnItem: T, actionName: string) => void
}

interface MultiActionButtonProps<T> extends ComponentProps {
	columnItem?: T
	buttonGroup: IMultiActionButtons<T>[]
}

const MultiActionButton = memo(function MultiActionButton<T>({
	columnItem,
	buttonGroup
}: MultiActionButtonProps<T>): JSX.Element {
	return (
		<>
			{buttonGroup?.map((btn, idx) => {
				return btn.isHidden ? null : (
					<button
						key={idx}
						className={cx(
							'btn btn-primary-light d-flex justify-content-center align-items-center',
							styles.multiActionButton,
							btn.className
						)}
						onClick={() => btn.onActionClick?.(columnItem, btn.name)}
					>
						{btn?.iconNameLeft && (
							<Icon iconName={btn.iconNameLeft} className={cx(styles.iconLeft)} />
						)}
						<span>{btn.name}</span>
						{btn?.iconNameRight && (
							<Icon iconName={btn.iconNameRight} className={cx(styles.iconRight)} />
						)}
					</button>
				)
			})}
		</>
	)
})
export default MultiActionButton
