/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import { Col, Row } from 'react-bootstrap'
import { memo, useEffect, useState } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import router from 'next/router'
import getServerSideTranslations from '~utils/getServerSideTranslations'
import ClientOnly from '~components/ui/ClientOnly'
import { useCurrentUser } from '~hooks/api/useCurrentuser'
import MyDataLayout from '~components/layouts/MyDataLayout'

export const getStaticProps = getServerSideTranslations()
interface NotFoundBodyProps {
	returnPath: string
}

const NotFoundBody = (props: NotFoundBodyProps) => {
	const { c } = useTranslation()
	return (
		<Col className='mt-5 mb-5'>
			<Row className='align-items-center mb-3'>
				<Col>
					<h2 className='d-flex align-items-center'>{c('notFound.title')}</h2>
					<div className='mt-5 mb-3'>{c('notFound.subtitle')}</div>
					<button
						className='btn btn-primary mt-3'
						type='button'
						onClick={() => {
							router.push(props.returnPath)
						}}
					>
						{c('notFound.goBackToMain')}
					</button>
				</Col>
			</Row>
		</Col>
	)
}

const NotFound = memo(function NotFound() {
	const { c } = useTranslation()
	const { currentUser } = useCurrentUser()
	const [isContact, setIsContact] = useState(false)

	useEffect(() => {
		if (currentUser?.__typename === 'Contact') {
			setIsContact(true)
		}
	}, [currentUser, setIsContact])

	return (
		<ClientOnly>
			{isContact ? (
				<MyDataLayout documentTitle={c('notFound.title')}>
					<NotFoundBody returnPath={'/mydata'} />
				</MyDataLayout>
			) : (
				<ContainerLayout documentTitle={c('notFound.title')}>
					<NotFoundBody returnPath='/' />
				</ContainerLayout>
			)}
		</ClientOnly>
	)
})

export default NotFound
