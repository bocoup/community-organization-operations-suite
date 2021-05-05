/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrimaryButton } from '@fluentui/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Layout from '~components/layouts/ContainerLayout'
import { getAuthUser, loginUser } from '~slices/authSlice'

export default function LoginPage(): JSX.Element {
	const auth = useSelector(getAuthUser)
	const dispatch = useDispatch()
	const router = useRouter()

	const handleLogin = () => {
		dispatch(loginUser())
	}

	useEffect(() => {
		if (auth.signedIn && !auth.loading) {
			void router.push('/')
		}
	}, [auth.signedIn, auth.loading, router])

	return (
		<Layout title='Login' showNav={false}>
			<p>Please Sign in to continue</p>
			<PrimaryButton
				text={auth.loading ? 'Loading...' : 'Login'}
				aria-label='Async Increment value'
				onClick={() => handleLogin()}
			/>
		</Layout>
	)
}
