/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FC, lazy, memo, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Spinner, SpinnerSize } from '@fluentui/react'
import ContainerLayout from '~components/layouts/ContainerLayout'
import { PushNotifications } from '~components/ui/PushNotifications'
import Footer from '~components/ui/Footer'

const NotFound = lazy(() => /* webpackChunkName: "NotFoundPage" */ import('~pages/404'))
const Index = lazy(() => /* webpackChunkName: "IndexPage" */ import('~pages/index'))
const Account = lazy(() => /* webpackChunkName: "AccountPage" */ import('~pages/account'))
const Clients = lazy(() => /* webpackChunkName: "ClientsPage" */ import('~pages/clients'))
const Specialist = lazy(() => /* webpackChunkName: "SpecialistPage" */ import('~pages/specialist'))
const Reporting = lazy(() => /* webpackChunkName: "ReportingPage" */ import('~pages/reporting'))
const Tags = lazy(() => /* webpackChunkName: "TagsPage" */ import('~pages/tags'))
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

export const AuthorizedRoutes: FC = memo(function AuthorizedRoutes() {
	return (
		<Route path='/'>
			<ContainerLayout>
				<PushNotifications />
				<Suspense fallback={<Spinner size={SpinnerSize.large} />}>
					<Switch>
						<Route exact path='/' component={Index} />
						<Route path='/account' component={Account} />
						<Route path='/clients' component={Clients} />
						<Route path='/specialist' component={Specialist} />
						<Route path='/reporting' component={Reporting} />
						<Route path='/tags' component={Tags} />
						<Route exact path='/services' component={ServicesIndex} />
						<Route path='/services/addService' component={AddService} />
						<Route path='/services/editService' component={EditService} />
						<Route path='/services/serviceKiosk' component={ServiceKiosk} />

						{/* Slash path matches all. It's used as a catch-all here for not-found routes */}
						<Route path='/' component={NotFound} />
					</Switch>
				</Suspense>
			</ContainerLayout>
			<Footer />
		</Route>
	)
})
