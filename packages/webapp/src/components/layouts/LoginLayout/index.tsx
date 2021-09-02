/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { withAITracking } from '@microsoft/applicationinsights-react-js'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import Head from 'next/head'
import ClientOnly from '~components/ui/ClientOnly'
import { memo } from 'react'
import Footer from '~components/ui/Footer'
import getStatic from '~utils/getStatic'
import { useTranslation } from '~hooks/useTranslation'
import { reactPlugin } from '~utils/appinsights'

interface LoginLayoutProps extends ComponentProps {
	title?: string
}

const LoginLayout = memo(function LoginLayout({ children }: LoginLayoutProps): JSX.Element {
	const { t } = useTranslation('login')
	return (
		<ClientOnly>
			<>
				<Head>
					<title>{t('pageTitle')}</title>
					<link
						href={getStatic('/images/favicon.ico')}
						rel='shortcut icon'
						type='image/x-icon'
					></link>
					<link href={getStatic('/images/favicon.ico')} rel='apple-touch-icon'></link>
				</Head>

				<div className={styles.root}>
					{children}

					<Footer />
				</div>
			</>
		</ClientOnly>
	)
})
export default withAITracking(reactPlugin, LoginLayout)
