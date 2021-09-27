/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import Head from 'react-helmet'
import ClientOnly from '~components/ui/ClientOnly'
import { memo } from 'react'
import Footer from '~components/ui/Footer'
import { useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'

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
					<link href={'/images/favicon.ico'} rel='shortcut icon' type='image/x-icon'></link>
					<link href={'/images/favicon.ico'} rel='apple-touch-icon'></link>
				</Head>

				<div className={styles.root}>
					{children}

					<Footer />
				</div>
			</>
		</ClientOnly>
	)
})
export default wrap(LoginLayout)
