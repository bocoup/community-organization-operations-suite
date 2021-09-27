/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import { Col, Row } from 'react-bootstrap'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import ClientOnly from '~components/ui/ClientOnly'
import { wrap } from '~utils/appinsights'
import { useHistory } from 'react-router-dom'

const NotFound = memo(function NotFound() {
	const history = useHistory()
	const { c } = useTranslation()

	return (
		<ContainerLayout documentTitle={c('notFound.title')}>
			<ClientOnly>
				<Col className='mt-5 mb-5'>
					<Row className='align-items-center mb-3'>
						<Col>
							<h2 className='d-flex align-items-center'>{c('notFound.title')}</h2>
							<div className='mt-5 mb-3'>{c('notFound.subtitle')}</div>
							<button
								className='btn btn-primary mt-3'
								type='button'
								onClick={() => {
									history.push('/')
								}}
							>
								{c('notFound.goBackToMain')}
							</button>
						</Col>
					</Row>
				</Col>
			</ClientOnly>
		</ContainerLayout>
	)
})

export default wrap(NotFound)
