/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useRouter } from 'next/router'
import LoginLayout from '~layouts/LoginLayout'
import LoginForm from '~components/forms/LoginForm'

export default function LoginPage(): JSX.Element {
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
}
