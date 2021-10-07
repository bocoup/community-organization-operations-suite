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
import { FC, memo } from 'react'
import { useNavCallback } from '~hooks/useNavCallback'
import { Service } from '@cbosuite/schema/dist/client-types'
import { ApplicationRoute } from '~types/ApplicationRoute'

export const ServiceListPanelBody: FC = wrap(function ServiceListPanelBody() {
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
			{serviceList.map((service) => (
				<ServiceListPanelItem service={service} key={service.id} />
			))}
		</div>
	)
})

const ServiceListPanelItem: FC<{ service: Service }> = memo(function ServiceListPanelItem({
	service
}) {
	const { t } = useTranslation('services')
	const onClick = useNavCallback(ApplicationRoute.ServiceKiosk, {
		sid: service.id
	})
	return (
		<Row className='d-flex mb-3 align-items-center'>
			<Col>
				<strong>{service.name}</strong>
			</Col>
			<Col className='d-flex justify-content-end'>
				<DefaultButton
					text={t('serviceListPanelBody.buttons.recordService')}
					className={cx(styles.actionsButton)}
					onClick={onClick}
				/>
			</Col>
		</Row>
	)
})
