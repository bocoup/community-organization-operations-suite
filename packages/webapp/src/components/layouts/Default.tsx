/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import CP from '~types/ComponentProps'
import { useAuthUser } from '~hooks/api/useAuth'

export interface DefaultLayoutProps extends CP {
	showNav?: boolean
}

export default function DefaultLayout({ children, showNav }: DefaultLayoutProps): JSX.Element {
	const router = useRouter()
	const { authUser } = useAuthUser()

	useEffect(() => {
		if (!authUser?.accessToken && router.route !== '/login') {
			void router.push('/login')
		}
	}, [authUser, router.pathname, router])

	return (
		<>
			<Head>
				<title>Greenlight - Community Health Resilience Tool</title>
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
			{children}
		</>
	)
}
