/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Col, Row } from 'react-bootstrap'
import { useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'
import { Title } from '~components/ui/Title'
import { useNavCallback } from '~hooks/useNavCallback'
import { ApplicationRoute } from '~types/ApplicationRoute'

const NotFoundPage = wrap(function NotFound() {
	const { c } = useTranslation()
	const title = c('notFound.title')
	const goHome = useNavCallback(ApplicationRoute.Index)
	return (
		<>
			<Title title={title} />
			<Col className='mt-5 mb-5 notFoundContainer'>
				<Row className='align-items-center mb-3'>
					<Col>
						<h2 className='d-flex align-items-center'>{title}</h2>
						<div className='mt-5 mb-3'>{c('notFound.subtitle')}</div>
						<button className='btn btn-primary mt-3' type='button' onClick={goHome}>
							{c('notFound.goBackToMain')}
						</button>
					</Col>
				</Row>
			</Col>
		</>
	)
})

export default NotFoundPage
