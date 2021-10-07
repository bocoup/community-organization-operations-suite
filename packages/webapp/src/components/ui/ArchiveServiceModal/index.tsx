/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect, useState } from 'react'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { wrap } from '~utils/appinsights'
import { Modal, PrimaryButton, DefaultButton, IconButton } from '@fluentui/react'
import { useTranslation } from '~hooks/useTranslation'
import cx from 'classnames'
import { noop } from '~utils/noop'

interface ArchiveServiceModalProps {
	serviceName: string
	showModal: boolean
	onSubmit?: () => void
	onDismiss?: () => void
}

export const ArchiveServiceModal: StandardFC<ArchiveServiceModalProps> = wrap(
	function ArchiveServiceModal({ serviceName, showModal, onSubmit = noop, onDismiss = noop }) {
		const { t } = useTranslation('services')
		const [isOpen, setIsOpen] = useState(showModal)

		useEffect(() => {
			setIsOpen(showModal)
		}, [showModal])

		const handleDismiss = () => {
			setIsOpen(false)
			onDismiss()
		}

		return (
			<Modal isOpen={isOpen} onDismiss={handleDismiss} isBlocking={false}>
				<div>
					<div className='d-flex justify-content-between align-items-center p-2 bg-primary text-light'>
						<div className='ms-2'>
							<strong>{t('archiveModal.title')}</strong>
						</div>
						<IconButton
							className='text-light btn btn-primary'
							iconProps={{ iconName: 'Cancel' }}
							ariaLabel={t('archiveModal.cancel')}
							onClick={handleDismiss}
						/>
					</div>
					<div className='p-3'>
						<p>{serviceName ? t('archiveModal.subText', { serviceName }) : ''}</p>
					</div>
					<div className='d-flex p-3 justify-content-end'>
						<PrimaryButton
							className={cx('me-3', styles.archiveButton)}
							onClick={onSubmit}
							text={t('archiveModal.title')}
						/>
						<DefaultButton
							className={styles.cancelButton}
							onClick={handleDismiss}
							text={t('archiveModal.cancel')}
						/>
					</div>
				</div>
			</Modal>
		)
	}
)
