/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Col, Row } from 'react-bootstrap'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'
import { useHistory } from 'react-router-dom'
import { Title } from '~components/ui/Title'

const NotFound = wrap(
	memo(function NotFound() {
		const history = useHistory()
		const { c } = useTranslation()
		const title = c('notFound.title')
		return (
			<>
				<Title title={title} />
				<Col className='mt-5 mb-5' data-testid='not-found-container'>
					<Row className='align-items-center mb-3'>
						<Col>
							<h2 className='d-flex align-items-center'>{title}</h2>
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
			</>
		)
	})
)

export default NotFound
