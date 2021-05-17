/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Modal as FluentModal } from '@fluentui/react'
import { useId } from '@fluentui/react-hooks'
import cx from 'classnames'
import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import ActionBar from '../ActionBar'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import IconButton from '~ui/IconButton'

interface ModalProps extends ComponentProps {
	title: string
	open?: boolean
	onDismiss?: () => void
	buttonOptions?: {
		label: string
		icon: string
	}
	showActionBar?: boolean
}

export default function Modal({
	children,
	title,
	open,
	buttonOptions,
	onDismiss,
	showActionBar = true
}: ModalProps): JSX.Element {
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
					onDismiss?.()
					setModalOpen(false)
				}}
				isBlocking={false}
				containerClassName={styles.container}
			>
				<div className={styles.header}>
					{showActionBar && <ActionBar showBack onBack={() => setModalOpen(false)} />}
				</div>
				<div className={styles.body}>{children}</div>
			</FluentModal>
		</div>
	)
}
