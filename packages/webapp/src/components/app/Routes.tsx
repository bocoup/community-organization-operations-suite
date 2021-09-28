/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { FC, lazy, memo, Suspense, useEffect } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import { Spinner, SpinnerSize } from '@fluentui/react'
import ContainerLayout from '~components/layouts/ContainerLayout'
import { createLogger } from '~utils/createLogger'
const logger = createLogger('Routes')

const Index = lazy(() => /* webpackChunkName: "IndexPage" */ import('~pages/index'))
const Account = lazy(() => /* webpackChunkName: "AccountPage" */ import('~pages/account'))
const Clients = lazy(() => /* webpackChunkName: "ClientsPage" */ import('~pages/clients'))
const Login = lazy(() => /* webpackChunkName: "LoginPage" */ import('~pages/login'))
const Logout = lazy(() => /* webpackChunkName: "LogoutPage" */ import('~pages/logout'))
const Specialist = lazy(() => /* webpackChunkName: "SpecialistPage" */ import('~pages/specialist'))
const Reporting = lazy(() => /* webpackChunkName: "ReportingPage" */ import('~pages/reporting'))
const Tags = lazy(() => /* webpackChunkName: "TagsPage" */ import('~pages/tags'))
const PasswordReset = lazy(
	() => /* webpackChunkName: "PasswordResetPage" */ import('~pages/passwordReset')
)
const ServicesIndex = lazy(
	() => /* webpackChunkName: "ServicesIndexPage" */ import('~pages/services')
)
const AddService = lazy(
	() => /* webpackChunkName: "AddServicePage" */ import('~pages/services/addService')
)
const EditService = lazy(
	() => /* webpackChunkName: "EditServicePage" */ import('~pages/services/editService')
)
const ServiceKiosk = lazy(
	() => /* webpackChunkName: "ServiceKioskPage" */ import('~pages/services/serviceKiosk')
)

export const Routes: FC = memo(function Routes() {
	const location = useLocation()
	useEffect(() => {
		logger('routes rendering', location.pathname)
	}, [location.pathname])
	return (
		<Suspense fallback={<Spinner size={SpinnerSize.large} />}>
			<Switch>
				<Route path='/login' component={Login} />
				<Route path='/logout' component={Logout} />
				<Route path='/passwordReset' component={PasswordReset} />

				<Route path='/'>
					<ContainerLayout>
						<Suspense fallback={<Spinner size={SpinnerSize.large} />}>
							<Switch>
								<Route path='/' component={Index} />
								<Route exact path='/' component={Index} />
								<Route path='/account' component={Account} />
								<Route path='/clients' component={Clients} />
								<Route path='/specialist' component={Specialist} />
								<Route path='/reporting' component={Reporting} />
								<Route path='/tags' component={Tags} />
								<Route path='/services' component={ServicesIndex} />
								<Route path='/services/addService' component={AddService} />
								<Route path='/services/editService' component={EditService} />
								<Route path='/services/serviceKiosk' component={ServiceKiosk} />
							</Switch>
						</Suspense>
					</ContainerLayout>
				</Route>
			</Switch>
		</Suspense>
	)
})
