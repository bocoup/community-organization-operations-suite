/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import Head from 'next/head'
import { Col, Row, Container } from 'react-bootstrap'
import cx from 'classnames'
import useWindowSize from '~hooks/useWindowSize'
import ClientOnly from '~components/ui/ClientOnly'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'

interface LoginLayoutProps extends ComponentProps {
	title?: string
}

const LoginLayout = memo(function LoginLayout({ children }: LoginLayoutProps): JSX.Element {
	const { t } = useTranslation('login')
	const { isMD } = useWindowSize()
	const rounded = isMD ? styles.formContainer : styles.formContainerNoRounded

	return (
		<ClientOnly>
			<>
				<Head>
					<title>{t('page.title')}</title>
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
										<h1 className='mb-5'>{t('header')}</h1>
										<p>{t('subHeader')}</p>
									</Col>
									<Col className={cx('shadow', rounded)}>{children}</Col>
								</Row>
								<Row className={styles.footer}>
									<Col></Col>
									<Col md={2}>
										<a
											target='_blank'
											rel='noreferrer'
											href='https://go.microsoft.com/fwlink/?LinkId=521839'
										>
											{t('privacyPolicy')}
										</a>
									</Col>
									<Col md={2}>{t('termsOfUse')}</Col>
									<Col md={2}>
										<a href='mailto:intakeprototype@googlegroups.com'>{t('sendFeedBack')}</a>
									</Col>
								</Row>
							</Col>
						</Row>
					</Container>
				</div>
			</>
		</ClientOnly>
	)
})
export default LoginLayout
