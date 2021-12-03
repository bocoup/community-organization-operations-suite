/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Modal as FluentModal } from '@fluentui/react'
import { useId } from '@fluentui/react-hooks'
import cx from 'classnames'
import { isEmpty } from 'lodash'
import { memo, useEffect, useState } from 'react'
import { ActionBar } from '../ActionBar'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { IconButton } from '~ui/IconButton'
import { noop } from '~utils/noop'

interface ModalProps {
	title: string
	open?: boolean
	onDismiss?: () => void
	buttonOptions?: {
		label: string
		icon: string
	}
	showActionBar?: boolean
}

export const Modal: StandardFC<ModalProps> = memo(function Modal({
	children,
	title,
	open,
	buttonOptions,
	onDismiss = noop,
	showActionBar = true
}) {
	const titleId = useId(title)
	const [isModalOpen, setModalOpen] = useState(false)

	useEffect(() => {
		// When open goes from false to true the modal should open
		if (open) {
			setModalOpen(true)
		}
	}, [open])

	return (
		<div className={cx(styles.wrapper)}>
			{buttonOptions && !isEmpty(buttonOptions) && (
				<IconButton
					icon={buttonOptions.icon}
					onClick={() => setModalOpen(true)}
					text={buttonOptions.label}
				/>
			)}
			<FluentModal
				titleAriaId={titleId}
				isOpen={isModalOpen}
				onDismiss={() => {
					onDismiss()
					setModalOpen(false)
				}}
				isBlocking={false}
				containerClassName={styles.container}
			>
				<div className={styles.header}>
					{showActionBar && <ActionBar showBack onBack={() => setModalOpen(false)} />}
				</div>
				<div className={cx('p-3', styles.body)}>{children}</div>
			</FluentModal>
		</div>
	)
})
