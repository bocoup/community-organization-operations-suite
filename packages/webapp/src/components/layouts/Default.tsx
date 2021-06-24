/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Head from 'next/head'
import { useRouter } from 'next/router'
import { memo, useEffect } from 'react'
import CP from '~types/ComponentProps'
import { useAuthUser } from '~hooks/api/useAuth'
import { get } from 'lodash'

export interface DefaultLayoutProps extends CP {
	showNav?: boolean
}

const RequestActionForm = memo(function DefaultLayout({
	children,
	showNav
}: DefaultLayoutProps): JSX.Element {
	const router = useRouter()
	const { authUser } = useAuthUser()
	// const { loadCurrentUser } = useCurrentUser()
	// const authId = get(authUser, 'user.id')
	const accessToken = get(authUser, 'accessToken')

	// FIXME: resolve comments; make sure this isn't needed
	// useEffect(() => {
	// 	if (
	// 		authId &&
	// 		pageMounted &&
	// 		accessToken &&
	// 		get(JSON.parse(localStorage.getItem('recoil-persist')), 'userAuthState.accessToken')
	// 	)
	// 		loadCurrentUser(authId)
	// }, [authId, accessToken, loadCurrentUser, pageMounted])

	useEffect(() => {
		if (!accessToken && router.route !== '/login') {
			void router.push('/login')
		}
	}, [accessToken, router.pathname, router])

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
})
export default RequestActionForm
