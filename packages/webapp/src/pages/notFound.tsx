/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import { useAuthUser } from '~hooks/api/useAuth'
import { useOrganization } from '~hooks/api/useOrganization'
import { get } from 'lodash'
import { Col, Row } from 'react-bootstrap'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import router from 'next/router'
import getServerSideTranslations from '~utils/getServerSideTranslations'

export const getStaticProps = getServerSideTranslations()

const NotFound = memo(function NotFound() {
	const { t } = useTranslation('common')
	const { authUser } = useAuthUser()
	const userRole = get(authUser, 'user.roles[0]')
	const { data: orgData } = useOrganization(userRole?.orgId)

	return (
		<ContainerLayout orgName={orgData?.name} documentTitle={t('notFound.title')}>
			<Col className='mt-5 mb-5'>
				<Row className='align-items-center mb-3'>
					<Col>
						<h2 className='d-flex align-items-center'>{t('notFound.title')}</h2>
						<div className='mt-5 mb-3'>{t('notFound.subtitle')}</div>
						<button
							className='btn btn-primary mt-3'
							type='button'
							onClick={() => {
								router.push('/')
							}}
						>
							{t('notFound.goBackToMain')}
						</button>
					</Col>
				</Row>
			</Col>
		</ContainerLayout>
	)
})

export default NotFound
