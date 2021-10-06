/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { LoginLayout } from '~layouts/LoginLayout'
import { FC, useEffect } from 'react'
import { useAuthUser } from '~hooks/api/useAuth'
import { wrap } from '~utils/appinsights'
import { useHistory } from 'react-router-dom'
import { useLocationQuery } from '~hooks/useLocationQuery'
import { navigate } from '~utils/navigate'

const LoginPage: FC = wrap(function LoginPage() {
	const history = useHistory()
	const { logout } = useAuthUser()
	const { error } = useLocationQuery()

	useEffect(() => {
		logout()
		setTimeout(() => {
			navigate(history, '/login', { error })
		}, 0)
	}, [history, logout, error])

	return <LoginLayout> </LoginLayout>
})

export default LoginPage
