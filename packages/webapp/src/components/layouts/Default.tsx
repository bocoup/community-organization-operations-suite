/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import Head from 'react-helmet'
import { useRouter } from 'next/router'
import { memo, useEffect } from 'react'
import CP from '~types/ComponentProps'
import Footer from '~components/ui/Footer'
import { useAuthUser } from '~hooks/api/useAuth'
import ClientOnly from '~ui/ClientOnly'
import { useTranslation } from '~hooks/useTranslation'
import usePushNotifications from '~hooks/usePushNotifications'
import { wrap } from '~utils/appinsights'
import { useHistory } from 'react-router-dom'

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
	const history = useHistory()
	const { accessToken } = useAuthUser()
	const { c } = useTranslation()
	const { initialize: initializePushNotifications } = usePushNotifications()

	// FIXME: resolve comments; make sure this isn't needed
	useEffect(() => {
		if (!accessToken && history.location.pathname !== '/login') {
			history.push('/login')
		}
	}, [accessToken, router.pathname, history])

	useEffect(() => {
		initializePushNotifications()
	}, [initializePushNotifications])

	return (
		<>
			<Head>
				<title>
					{c('app.head.title')} - {title || c('app.head.subTitle')}
				</title>
			</Head>

			{children}

			<ClientOnly>
				<Footer />
			</ClientOnly>
		</>
	)
})
export default wrap(RequestActionForm)
