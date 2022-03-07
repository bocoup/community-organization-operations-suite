/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { LoginLayout } from '~layouts/LoginLayout'
import type { FC } from 'react'
import { useEffect } from 'react'
import { useAuthUser } from '~hooks/api/useAuth'
import { wrap } from '~utils/appinsights'
import { useHistory } from 'react-router-dom'
import { useLocationQuery } from '~hooks/useLocationQuery'
import { useNavCallback } from '~hooks/useNavCallback'
import { ApplicationRoute } from '~types/ApplicationRoute'

const LoginPage: FC = wrap(function LoginPage() {
	const history = useHistory()
	const { logout } = useAuthUser()
	const { error } = useLocationQuery()
	const goToLogin = useNavCallback(ApplicationRoute.Login, { error })

	useEffect(() => {
		logout()
		setTimeout(goToLogin, 0)
	}, [history, logout, goToLogin])

	return <LoginLayout> </LoginLayout>
})

export default LoginPage
