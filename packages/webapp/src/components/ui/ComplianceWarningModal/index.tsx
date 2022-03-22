/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FC } from 'react'
import { memo } from 'react'
import { Modal, IconButton } from '@fluentui/react'
import { useTranslation } from '~hooks/useTranslation'
import { useRecoilState } from 'recoil'
import { isComplianceWarningOpenState } from '~store'
import { config } from '~utils/config'

export const ComplianceWarningModal: FC = memo(function ComplianceWarningModal() {
	const [isComplianceWarningOpen, setComplianceWarningOpen] = useRecoilState(
		isComplianceWarningOpenState
	)
	const { c } = useTranslation()

	if (!config.features.complianceModal.enabled) return null

	return (
		<Modal
			titleAriaId={'compliance-warning-title'}
			isOpen={isComplianceWarningOpen}
			onDismiss={() => setComplianceWarningOpen(false)}
			isBlocking={false}
		>
			<div>
				<div className='d-flex justify-content-between align-items-center p-2 bg-danger text-light'>
					<div id={'compliance-warning-title'}>{c('complianceWarning.title')}</div>
					<IconButton
						className='text-light btn btn-danger'
						iconProps={{ iconName: 'Cancel' }}
						ariaLabel={c('complianceWarning.closeAriaLabel')}
						onClick={() => setComplianceWarningOpen(false)}
					/>
				</div>
				<div className='p-3'>
					<p>{c('complianceWarning.body')}</p>
				</div>
			</div>
		</Modal>
	)
})
