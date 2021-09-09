/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styles from './index.module.scss'
import { wrap } from '~utils/appinsights'
import { useRecoilValue } from 'recoil'
import { useTranslation } from '~hooks/useTranslation'
import { serviceListState } from '~store'
import { Col, Row } from 'react-bootstrap'
import { DefaultButton } from '@fluentui/react'
import cx from 'classnames'
import { useRouter } from 'next/router'

const ServiceListPanelBody = memo(function ServiceListPanelBody(): JSX.Element {
	const { t } = useTranslation('services')
	const servicelist = useRecoilValue(serviceListState)
	const router = useRouter()

	return (
		<div>
			<Row className='d-flex mb-5'>
				<Col>
					<h3>{t('serviceListPanelBody.title')}</h3>
				</Col>
			</Row>
			{servicelist.map((service, index) => (
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
									`${router.pathname}/services/serviceKiosk?sid=${service.id}`,
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
