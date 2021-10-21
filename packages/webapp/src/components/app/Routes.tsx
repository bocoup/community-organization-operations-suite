/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FC, lazy, memo, Suspense, useEffect } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import { Spinner, SpinnerSize } from '@fluentui/react'
import { createLogger } from '~utils/createLogger'
import { AuthorizedRoutes } from './AuthorizedRoutes'
import { ApplicationRoute } from '~types/ApplicationRoute'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
const logger = createLogger('Routes')

const Login = lazy(() => /* webpackChunkName: "LoginPage" */ import('~pages/login'))
const Logout = lazy(() => /* webpackChunkName: "LogoutPage" */ import('~pages/logout'))
const PasswordReset = lazy(
	() => /* webpackChunkName: "PasswordResetPage" */ import('~pages/passwordReset')
)

export const Routes: FC = memo(function Routes() {
	const location = useLocation()
	const { currentUser } = useCurrentUser()
	useEffect(() => {
		logger('routes rendering', location.pathname)
	}, [location.pathname])
	return (
		<Suspense fallback={<Spinner className='waitSpinner' size={SpinnerSize.large} />}>
			<Switch>
				<Route path={ApplicationRoute.Login} component={Login} />
				<Route path={ApplicationRoute.Logout} component={Logout} />
				<Route path={ApplicationRoute.PasswordReset} component={PasswordReset} />
				<Route
					path={ApplicationRoute.Index}
					component={currentUser?.id ? AuthorizedRoutes : Login}
				/>
			</Switch>
		</Suspense>
	)
})
