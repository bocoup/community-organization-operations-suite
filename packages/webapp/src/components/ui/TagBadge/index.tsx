/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import type { Tag } from '@cbosuite/schema/dist/client-types'
import { Overlay } from 'react-bootstrap'
import { memo, useState, useRef } from 'react'

interface TagBadgeProps {
	tag: Tag
	light?: boolean
	maxLength?: number
}

export const TagBadge: StandardFC<TagBadgeProps> = memo(function TagBadge({
	tag,
	className,
	light = false,
	maxLength = 999
}) {
	const [show, setShow] = useState(false)
	const target = useRef(null)

	if (tag.label.length > maxLength) {
		return (
			<>
				<span
					ref={target}
					onMouseEnter={() => setShow(true)}
					onMouseLeave={() => setShow(false)}
					className={cx(
						styles.tagBadge,
						styles.tagBadgeMaxLength,
						'p-1 px-3 me-2',
						light ? 'bg-white text-primary-dark' : 'bg-dark text-white',
						className
					)}
				>
					{tag.label.substring(0, maxLength) + '...'}
				</span>
				<Overlay target={target.current} show={show} placement='left-start'>
					{({ placement, arrowProps, show: _show, popper, ...props }) => (
						<div {...props} className={styles.tagBadgeTooltip}>
							<div
								className={cx(
									styles.tagBadgeTooltipInner,
									light ? 'bg-white text-primary-dark' : 'bg-dark text-white'
								)}
							>
								{tag.label}
							</div>
						</div>
					)}
				</Overlay>
			</>
		)
	} else {
		return (
			<span
				className={cx(
					styles.tagBadge,
					'p-1 px-3 me-2',
					light ? 'bg-white text-primary-dark' : 'bg-dark text-white',
					className
				)}
			>
				{tag.label}
			</span>
		)
	}
})
