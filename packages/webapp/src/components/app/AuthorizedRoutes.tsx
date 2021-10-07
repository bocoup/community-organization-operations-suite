/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FC, lazy, memo, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Spinner, SpinnerSize } from '@fluentui/react'
import { ContainerLayout } from '~components/layouts/ContainerLayout'
import { PushNotifications } from '~components/ui/PushNotifications'
import { Footer } from '~components/ui/Footer'
import { ApplicationRoute } from '~types/ApplicationRoute'

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
		<>
			<ContainerLayout>
				<PushNotifications />
				<Suspense fallback={<Spinner className='waitSpinner' size={SpinnerSize.large} />}>
					<Switch>
						<Route exact path={ApplicationRoute.Index} component={Index} />
						<Route path={ApplicationRoute.Account} component={Account} />
						<Route path={ApplicationRoute.Clients} component={Clients} />
						<Route path={ApplicationRoute.Specialist} component={Specialist} />
						<Route path={ApplicationRoute.Reporting} component={Reporting} />
						<Route path={ApplicationRoute.Tags} component={Tags} />
						<Route exact path={ApplicationRoute.Services} component={ServicesIndex} />
						<Route path={ApplicationRoute.AddService} component={AddService} />
						<Route path={ApplicationRoute.EditService} component={EditService} />
						<Route path={ApplicationRoute.ServiceKiosk} component={ServiceKiosk} />

						{/* Slash path matches all. It's used as a catch-all here for not-found routes */}
						<Route path={ApplicationRoute.Index} component={NotFound} />
					</Switch>
				</Suspense>
			</ContainerLayout>
			<Footer />
		</>
	)
})
