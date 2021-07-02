/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
//import ContainerLayout from '~layouts/ContainerLayout'
import { useAuthUser } from '~hooks/api/useAuth'
import { useOrganization } from '~hooks/api/useOrganization'
import { get } from 'lodash'
//import { Col, Row } from 'react-bootstrap'
import { memo } from 'react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
//import router from 'next/router'
import NextErrorComponent from 'next/error'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale, ['common', 'footer']))
		}
	}
}

const NotFound = memo(function NotFound() {
	const { t } = useTranslation('common')
	//const { authUser } = useAuthUser()
	//const userRole = get(authUser, 'user.roles[0]')
	//const { data: orgData } = useOrganization(userRole?.orgId)

	return (
		<NextErrorComponent statusCode={404} title={t('notFound.title')} />
		// <ContainerLayout orgName={orgData?.name} documentTitle={t('notFound.title')}>
		// 	<Col className='mt-5 mb-5'>
		// 		<Row className='align-items-center mb-3'>
		// 			<Col>
		// 				<h2 className='d-flex align-items-center'>{t('notFound.title')}</h2>
		// 				<div className='mt-5 mb-3'>{t('notFound.subtitle')}</div>
		// 				<button
		// 					className='btn btn-primary mt-3'
		// 					type='button'
		// 					onClick={() => {
		// 						router.push('/')
		// 					}}
		// 				>
		// 					{t('notFound.goBackToMain')}
		// 				</button>
		// 			</Col>
		// 		</Row>
		// 	</Col>
		// </ContainerLayout>
	)
})
export default NotFound
