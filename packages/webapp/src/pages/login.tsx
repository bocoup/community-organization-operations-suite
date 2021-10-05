/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { LoginLayout } from '~layouts/LoginLayout'
import { LoginPageBody } from '~components/ui/LoginPageBody'
import { wrap } from '~utils/appinsights'

const LoginPage = wrap(function LoginPage(): JSX.Element {
	return (
		<LoginLayout>
			<LoginPageBody />
		</LoginLayout>
	)
})

export default LoginPage
