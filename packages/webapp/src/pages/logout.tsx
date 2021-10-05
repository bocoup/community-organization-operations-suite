/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { LoginLayout } from '~layouts/LoginLayout'
import { memo, useEffect } from 'react'
import { useAuthUser } from '~hooks/api/useAuth'
import { wrap } from '~utils/appinsights'
import { useHistory } from 'react-router-dom'
import { useLocationQuery } from '~hooks/useLocationQuery'

const LoginPage = wrap(
	memo(function LoginPage(): JSX.Element {
		const history = useHistory()
		const { logout } = useAuthUser()
		const { error: errorArg } = useLocationQuery()

		useEffect(() => {
			logout()
			setTimeout(() => history.push(`/login${errorArg ? '?error=' + errorArg : ''}`), 0)
		}, [history, logout, errorArg])

		return <LoginLayout> </LoginLayout>
	})
)

export default LoginPage
