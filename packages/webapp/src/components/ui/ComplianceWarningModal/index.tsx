/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { Modal, IconButton } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { useTranslation } from '~hooks/useTranslation'

const ComplianceWarningModal = memo(function ComplianceWarningModal(): JSX.Element {
	const [isModalOpen, { setFalse: hideModal }] = useBoolean(true)
	const { c } = useTranslation()

	if (process.env.NODE_ENV === 'development') return null

	return (
		<Modal
			titleAriaId={'compliance-warning-title'}
			isOpen={isModalOpen}
			onDismiss={hideModal}
			isBlocking={false}
		>
			<div>
				<div className='d-flex justify-content-between align-items-center p-2 bg-danger text-light'>
					<div id={'compliance-warning-title'}>{c('complianceWarning.title')}</div>
					<IconButton
						className='text-light btn btn-danger'
						iconProps={{ iconName: 'Cancel' }}
						ariaLabel={c('complianceWarning.close.ariaLabel')}
						onClick={hideModal}
					/>
				</div>
				<div className='p-3'>
					<p>{c('complianceWarning.body')}</p>
				</div>
			</div>
		</Modal>
	)
})
export default ComplianceWarningModal
