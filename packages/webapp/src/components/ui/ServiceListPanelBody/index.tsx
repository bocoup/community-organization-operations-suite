/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styles from './index.module.scss'
import { wrap } from '~utils/appinsights'
import { useTranslation } from '~hooks/useTranslation'
import { Col, Row } from 'react-bootstrap'
import { DefaultButton } from '@fluentui/react'
import cx from 'classnames'
import { useRouter } from 'next/router'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useServiceList } from '~hooks/api/useServiceList'

const ServiceListPanelBody = memo(function ServiceListPanelBody(): JSX.Element {
	const { t } = useTranslation('services')
	const { orgId } = useCurrentUser()
	const { serviceList } = useServiceList(orgId)
	const router = useRouter()

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
								router.push(
									`${router.pathname}services/serviceKiosk?sid=${service.id}`,
									undefined,
									{
										shallow: true
									}
								)
							}
						/>
					</Col>
				</Row>
			))}
		</div>
	)
})
export default wrap(ServiceListPanelBody)
