/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import Head from 'next/head'
import ClientOnly from '~components/ui/ClientOnly'
import { memo } from 'react'
import { useTranslation } from 'next-i18next'
import Footer from '~components/ui/Footer'

interface LoginLayoutProps extends ComponentProps {
	title?: string
}

const LoginLayout = memo(function LoginLayout({ children }: LoginLayoutProps): JSX.Element {
	const { t } = useTranslation('login')

	return (
		<ClientOnly>
			<Head>
				<title>{t('page.title')}</title>
				<link href='/images/favicon.svg' rel='shortcut icon' type='image/x-icon'></link>
				<link href='/images/favicon.png' rel='apple-touch-icon'></link>
			</Head>

			<div className={styles.root}>
				{children}
				<Footer />
			</div>
		</ClientOnly>
	)
})
export default LoginLayout
