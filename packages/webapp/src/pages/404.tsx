/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ClientOnly from '~components/ui/ClientOnly'
import { memo } from 'react'
import Head from 'next/head'
import { Col, Row, Container } from 'react-bootstrap'

const NotFoundPage = memo(function NotFoundPage(): JSX.Element {
	return (
		<ClientOnly>
			<Head>
				<title>Greenlight - Page not found</title>
				<link
					href='https://uploads-ssl.webflow.com/5fe5c5e2a8976c9be6b9a0e5/5fe5c5e2a8976c7d38b9a1d3_favicon.svg'
					rel='shortcut icon'
					type='image/x-icon'
				></link>
				<link
					href='https://uploads-ssl.webflow.com/5fe5c5e2a8976c9be6b9a0e5/5fee567345a05d2a674a4cdb_Icon.png'
					rel='apple-touch-icon'
				></link>
			</Head>
			<Container>
				<Row>
					<Col className='d-flex justify-content-center vh-100 align-items-center'>
						<Row>
							<h1>404 - Page not found</h1>
							<h2>
								Please click <a href='/'>here</a> to go to main page.
							</h2>
						</Row>
					</Col>
				</Row>
			</Container>
		</ClientOnly>
	)
})

export default NotFoundPage
