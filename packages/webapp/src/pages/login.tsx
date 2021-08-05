/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import LoginLayout from '~layouts/LoginLayout'
import { memo } from 'react'
import getServerSideTranslations from '~utils/getServerSideTranslations'
import LoginPageBody from '~components/ui/LoginPageBody'

export const getStaticProps = getServerSideTranslations(['login'])

const LoginPage = memo(function LoginPage(): JSX.Element {
	return (
		<LoginLayout>
			<LoginPageBody />
		</LoginLayout>
	)
})

export default LoginPage
