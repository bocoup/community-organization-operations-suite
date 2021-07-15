/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useRouter } from 'next/router'
import LoginLayout from '~layouts/LoginLayout'
import LoginForm from '~components/forms/LoginForm'
import { memo, useEffect, useState } from 'react'
import getServerSideTranslations from '~utils/getServerSideTranslations'
import { useTranslation } from '~hooks/useTranslation'

export const getStaticProps = getServerSideTranslations(['login'])

const LoginPage = memo(function LoginPage(): JSX.Element {
	const router = useRouter()
	const [error, setError] = useState<string>()
	const { c } = useTranslation()

	const handleLogin = (status: string) => {
		if (status === 'success') {
			void router.push('/')
		}
	}

	useEffect(() => {
		const error = router.query?.error
		if (error === 'UNAUTHENTICATED') {
			setError(c('errors.unauthenticated'))
		}
	}, [router, c])

	useEffect(() => {
		if (typeof localStorage !== undefined) localStorage.removeItem('recoil-persist')
	}, [])

	return (
		<LoginLayout>
			<LoginForm onLoginClick={status => handleLogin(status)} error={error} />
		</LoginLayout>
	)
})

export default LoginPage
