/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FC } from 'react'
import { lazy, memo, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import { ContainerLayout } from '~components/layouts/ContainerLayout'
import { PushNotifications } from '~components/ui/PushNotifications'
import { Footer } from '~components/ui/Footer'
import { ApplicationRoute } from '~types/ApplicationRoute'
import { LoadingPlaceholder } from '~ui/LoadingPlaceholder'
import styles from './AuthorizedRoutes.module.scss'

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
const ServiceEntry = lazy(
	() => /* webpackChunkName: "ServiceEntryPage" */ import('~pages/services/serviceEntry')
)

export const AuthorizedRoutes: FC = memo(function AuthorizedRoutes() {
	return (
		<Switch>
			<Route path={ApplicationRoute.ServiceKioskMode} component={ServiceEntry} />
			<>
				<div className={styles.appContainer}>
					<ContainerLayout>
						<PushNotifications />
						<Suspense fallback={<LoadingPlaceholder />}>
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
								<Route path={ApplicationRoute.ServiceEntry} component={ServiceEntry} />
								{/* Slash path matches all. It's used as a catch-all here for not-found routes */}
								<Route path={ApplicationRoute.Index} component={NotFound} />
							</Switch>
						</Suspense>
					</ContainerLayout>
					<Footer />
				</div>
			</>
		</Switch>
	)
})
