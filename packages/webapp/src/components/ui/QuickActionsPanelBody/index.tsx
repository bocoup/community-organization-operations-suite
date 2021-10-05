/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styles from './index.module.scss'
import type { ComponentProps } from '~types/ComponentProps'
import { wrap } from '~utils/appinsights'
import { Col, Row } from 'react-bootstrap'
import { DefaultButton } from '@fluentui/react'
import cx from 'classnames'
import { useTranslation } from '~hooks/useTranslation'

interface QuickActionsPanelBodyProps extends ComponentProps {
	onButtonClick?: (buttonName: string) => void
}

const QuickActionsPanelBody = memo(function QuickActionsPanelBody({
	onButtonClick
}: QuickActionsPanelBodyProps): JSX.Element {
	const { t } = useTranslation('services')

	return (
		<div>
			<Row className='d-flex mb-5'>
				<Col>
					<h3>{t('quickActionsPanelBody.title')}</h3>
				</Col>
			</Row>
			<Row className='d-flex mb-3 align-items-center'>
				<Col>
					<strong>{t('quickActionsPanelBody.addNewClient')}</strong>
				</Col>
				<Col className='d-flex justify-content-end'>
					<DefaultButton
						text={t('quickActionsPanelBody.buttons.addNewClient')}
						className={cx(styles.actionsButton)}
						onClick={() => onButtonClick?.('addClientForm')}
					/>
				</Col>
			</Row>
			<Row className='d-flex mb-3 align-items-center'>
				<Col>
					<strong>{t('quickActionsPanelBody.createNewRequest')}</strong>
				</Col>
				<Col className='d-flex justify-content-end'>
					<DefaultButton
						text={t('quickActionsPanelBody.buttons.createNewRequest')}
						className={cx(styles.actionsButton)}
						onClick={() => onButtonClick?.('addRequestForm')}
					/>
				</Col>
			</Row>
		</div>
	)
})
export default wrap(QuickActionsPanelBody)
