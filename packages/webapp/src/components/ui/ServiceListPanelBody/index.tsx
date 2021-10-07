/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import { wrap } from '~utils/appinsights'
import { useTranslation } from '~hooks/useTranslation'
import { Col, Row } from 'react-bootstrap'
import { DefaultButton } from '@fluentui/react'
import cx from 'classnames'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useServiceList } from '~hooks/api/useServiceList'
import { useHistory } from 'react-router-dom'
import { FC } from 'react'
import { navigate } from '~utils/navigate'

export const ServiceListPanelBody: FC = wrap(function ServiceListPanelBody() {
	const history = useHistory()
	const { t } = useTranslation('services')
	const { orgId } = useCurrentUser()
	const { serviceList } = useServiceList(orgId)

	return (
		<div>
			<Row className='d-flex mb-5'>
				<Col>
					<h3>{t('serviceListPanelBody.title')}</h3>
				</Col>
			</Row>
			{serviceList.map((service, index) => (
				<Row key={index} className='d-flex mb-3 align-items-center'>
					<Col>
						<strong>{service.name}</strong>
					</Col>
					<Col className='d-flex justify-content-end'>
						<DefaultButton
							text={t('serviceListPanelBody.buttons.recordService')}
							className={cx(styles.actionsButton)}
							onClick={() =>
								navigate(history, `services/serviceKiosk`, {
									sid: service.id
								})
							}
						/>
					</Col>
				</Row>
			))}
		</div>
	)
})
