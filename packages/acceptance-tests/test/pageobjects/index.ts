/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Page } from '@playwright/test'

import { ClientsPage } from './ClientsPage'
import { DashboardPage } from './DashboardPage'
import { Header } from './Header'
import { LoginPage } from './LoginPage'
import { LogoutPage } from './LogoutPage'
import { NewClientPanel } from './NewClientPanel'
import { NewRequestPanel } from './NewRequestPanel'
import { ProfilePage } from './ProfilePage'
import { ReportPage } from './ReportPage'
import { ServicesPage } from './ServicesPage'
import { SpecialistsPage } from './SpecialistsPage'
import { TagsPage } from './TagsPage'
import { NotFoundPage } from './NotFoundPage'

export interface PageObjects {
	clientsPage: ClientsPage
	dashboardPage: DashboardPage
	header: Header
	loginPage: LoginPage
	logoutPage: LogoutPage
	newClientPanel: NewClientPanel
	newRequestPanel: NewRequestPanel
	profilePage: ProfilePage
	reportPage: ReportPage
	servicesPage: ServicesPage
	specialistsPage: SpecialistsPage
	tagsPage: TagsPage
	notFoundPage: NotFoundPage
}

export function createPageObjects(page: Page): PageObjects {
	return {
		clientsPage: new ClientsPage(page),
		dashboardPage: new DashboardPage(page),
		header: new Header(page),
		loginPage: new LoginPage(page),
		logoutPage: new LogoutPage(page),
		newClientPanel: new NewClientPanel(page),
		newRequestPanel: new NewRequestPanel(page),
		profilePage: new ProfilePage(page),
		reportPage: new ReportPage(page),
		servicesPage: new ServicesPage(page),
		specialistsPage: new SpecialistsPage(page),
		tagsPage: new TagsPage(page),
		notFoundPage: new NotFoundPage(page)
	}
}
