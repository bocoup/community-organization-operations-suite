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
import { useTranslation } from 'next-i18next'
import Footer from '~components/ui/Footer'

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

				<div className={styles.root}>
					<div className={isMD ? styles.loginLayout : styles.loginLayoutSm}>
						<Container>
							<Row className='justify-content-center'>
								<Col md={8} className={styles.mainContainer}>
									<Row>
										<Col sm={12} md={6} style={{ padding: '20px 40px 20px 10px', color: 'white' }}>
											<h1 className='mb-5'>{t('header')}</h1>
											<p>{t('subHeader')}</p>
										</Col>
										<Col className={cx('shadow', rounded)}>{children}</Col>
									</Row>
								</Col>
							</Row>
						</Container>
					</div>
					<Footer />
				</div>
			</>
		</ClientOnly>
	)
})
export default LoginLayout
