/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FC, lazy, memo, Suspense, useEffect } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import { Spinner, SpinnerSize } from '@fluentui/react'
import { createLogger } from '~utils/createLogger'
import { useAuthUser } from '~hooks/api/useAuth'
import { AuthorizedRoutes } from './AuthorizedRoutes'
const logger = createLogger('Routes')

const Login = lazy(() => /* webpackChunkName: "LoginPage" */ import('~pages/login'))
const Logout = lazy(() => /* webpackChunkName: "LogoutPage" */ import('~pages/logout'))
const PasswordReset = lazy(
	() => /* webpackChunkName: "PasswordResetPage" */ import('~pages/passwordReset')
)

export const Routes: FC = memo(function Routes() {
	const location = useLocation()
	const { accessToken } = useAuthUser()
	useEffect(() => {
		logger('routes rendering', location.pathname)
	}, [location.pathname])
	return (
		<Suspense fallback={<Spinner className='waitSpinner' size={SpinnerSize.large} />}>
			<Switch>
				<Route path='/login' component={Login} />
				<Route path='/logout' component={Logout} />
				<Route path='/passwordReset' component={PasswordReset} />

				{accessToken ? <AuthorizedRoutes /> : <Route path='/' component={Login} />}
			</Switch>
		</Suspense>
	)
})