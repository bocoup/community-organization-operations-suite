/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Icon } from '@fluentui/react'
import cx from 'classnames'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { memo } from 'react'
import { empty, noop } from '~utils/noop'
export interface IMultiActionButtons<T> {
	name: string
	iconOnly?: boolean
	className?: string
	iconNameLeft?: string
	iconNameRight?: string
	isHidden?: boolean
	onActionClick?: (columnItem: T, actionName: string) => void
}

interface MultiActionButtonProps<T> {
	columnItem?: T
	buttonGroup: IMultiActionButtons<T>[]
}

export const MultiActionButton: StandardFC<MultiActionButtonProps<unknown>> = memo(
	function MultiActionButton({ columnItem, buttonGroup = empty }) {
		return (
			<>
				{buttonGroup.map(
					(
						{ className, isHidden, onActionClick = noop, name, iconNameLeft, iconNameRight },
						idx
					) => {
						return isHidden ? null : (
							<button
								key={idx}
								className={cx(
									'btn btn-primary d-flex justify-content-center align-items-center',
									styles.multiActionButton,
									className
								)}
								onClick={() => onActionClick(columnItem, name)}
							>
								{iconNameLeft && <Icon iconName={iconNameLeft} className={cx(styles.iconLeft)} />}
								<span>{name}</span>
								{iconNameRight && (
									<Icon iconName={iconNameRight} className={cx(styles.iconRight)} />
								)}
							</button>
						)
					}
				)}
			</>
		)
	}
)
