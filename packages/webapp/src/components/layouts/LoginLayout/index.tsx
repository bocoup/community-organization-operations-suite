/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import DefaultLayout from '~layouts/Default'
import { Col, Row, Container } from 'react-bootstrap'
import cx from 'classnames'
import useWindowSize from '~hooks/useWindowSize'
import ClientOnly from '~components/ui/ClientOnly'

interface LoginLayoutProps extends ComponentProps {
	title?: string
}

export default function LoginLayout({ children }: LoginLayoutProps): JSX.Element {
	const { isMD } = useWindowSize()
	const rounded = isMD ? styles.formContainer : styles.formContainerNoRounded
	return (
		<ClientOnly>
			<DefaultLayout>
				<div className={isMD ? styles.loginLayout : styles.loginLayoutSm}>
					<Container>
						<Row className='justify-content-center'>
							<Col md={8} className={styles.mainContainer}>
								<Row className='pb-5'>
									<Col>
										<img
											src='https://uploads-ssl.webflow.com/5fe5c5e2a8976c9be6b9a0e5/5fe5c5e2a8976c6d21b9a137_logo.svg'
											className={styles.logo}
											alt='greenlight logo'
										/>
									</Col>
								</Row>
								<Row>
									<Col sm={12} md={6} style={{ padding: '20px 40px 20px 10px', color: 'white' }}>
										<h1 className='mb-5'>Welcome to Community Health Resilience Tool</h1>
										<p>
											Greenlight is a health resilience system leveraging the experience of a team
											that supported community efforts. We bring together three pillars to
											accelerate reopening and support community organizations address health and
											social disparities.
										</p>
									</Col>
									<Col className={cx('shadow', rounded)}>{children}</Col>
								</Row>
								<Row className={styles.footer}>
									<Col></Col>
									<Col md={2}>Privacy Policy</Col>
									<Col md={2}>Terms of Use</Col>
								</Row>
							</Col>
						</Row>
					</Container>
				</div>
			</DefaultLayout>
		</ClientOnly>
	)
}
