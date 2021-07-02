/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useRouter } from 'next/router'
import LoginLayout from '~layouts/LoginLayout'
import LoginForm from '~components/forms/LoginForm'
import { memo } from 'react'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale, ['login']))
		}
	}
}

const LoginPage = memo(function LoginPage(): JSX.Element {
	const router = useRouter()

	const handleLogin = (status: string) => {
		if (status === 'success') {
			void router.push('/')
		}
	}

	return (
		<LoginLayout>
			<LoginForm onLoginClick={status => handleLogin(status)} />
		</LoginLayout>
	)
})
export default LoginPage
