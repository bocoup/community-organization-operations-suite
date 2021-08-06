/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Head from 'next/head'
import { useRouter } from 'next/router'
import { memo, useEffect } from 'react'
import CP from '~types/ComponentProps'
import Footer from '~components/ui/Footer'
import { useAuthUser } from '~hooks/api/useAuth'
import ClientOnly from '~ui/ClientOnly'
import ComplianceWarningModal from '~components/ui/ComplianceWarningModal'
import { useTranslation } from '~hooks/useTranslation'
import getStatic from '~utils/getStatic'

export interface DefaultLayoutProps extends CP {
	showNav?: boolean
	title?: string
}

const RequestActionForm = memo(function DefaultLayout({
	children,
	showNav,
	title
}: DefaultLayoutProps): JSX.Element {
	const router = useRouter()
	const { accessToken } = useAuthUser()
	const { c } = useTranslation()

	// FIXME: resolve comments; make sure this isn't needed
	useEffect(() => {
		if (!accessToken && router.route !== '/login') {
			void router.push('/login')
		}
	}, [accessToken, router.pathname, router])

	return (
		<>
			<Head>
				<title>
					{c('app.head.title')} - {title || c('app.head.subTitle')}
				</title>
				<link
					href={getStatic('/images/favicon.svg')}
					rel='shortcut icon'
					type='image/x-icon'
				></link>
				<link href={getStatic('/images/favicon.png')} rel='apple-touch-icon'></link>
			</Head>

			<ComplianceWarningModal />

			{children}

			<ClientOnly>
				<Footer />
			</ClientOnly>
		</>
	)
})
export default RequestActionForm
