/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuthUser } from '~hooks/api/useAuth'
import LoginLayout from '~layouts/LoginLayout'
import LoginForm from '~components/forms/LoginForm'

export default function LoginPage(): JSX.Element {
	const { login, authUser } = useAuthUser()
	const router = useRouter()
	const handleLogin = async values => {
		await login(values.username, values.password)
	}

	useEffect(() => {
		if (authUser?.accessToken) {
			void router.push('/')
		}
	}, [router, authUser])

	return (
		<LoginLayout>
			<LoginForm onClick={handleLogin} loginSuccess={authUser?.message !== 'Auth Failure'} />
		</LoginLayout>
	)
}
