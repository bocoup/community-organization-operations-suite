/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import { DefaultButton, PrimaryButton } from '@fluentui/react'
import { FC, memo } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import styles from './index.module.scss'

export const ActionRow: FC<{
	isSubmitEnabled: boolean
	onSubmit: () => void
	onQuickActions: () => void
}> = memo(function ActionRow({ isSubmitEnabled, onSubmit, onQuickActions }) {
	const { t } = useTranslation(Namespace.Services)
	return (
		<Row>
			<Col>
				<PrimaryButton
					text={t('formGenerator.buttons.submit')}
					className={cx('me-3', styles.submitButton)}
					disabled={!isSubmitEnabled}
					onClick={onSubmit}
				/>
			</Col>
			{onQuickActions && (
				<Col md={4}>
					<DefaultButton
						text={t('formGenerator.buttons.quickActions')}
						className={cx('me-3', styles.quickActionsButton)}
						onClick={onQuickActions}
					/>
				</Col>
			)}
		</Row>
	)
})
