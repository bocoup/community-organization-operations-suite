/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Page } from '@playwright/test'
import { configuration } from '../configuration'

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
import { AddServicePage } from './AddServicePage'

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
	addServicePage: AddServicePage
	sequences: {
		login: () => Promise<void>
		selectSpanishLanguage: () => Promise<void>
		selectEnglishLanguage: () => Promise<void>
	}
}

export function createPageObjects(page: Page): PageObjects {
	const clientsPage = new ClientsPage(page)
	const dashboardPage = new DashboardPage(page)
	const header = new Header(page)
	const loginPage = new LoginPage(page)
	const logoutPage = new LogoutPage(page)
	const newClientPanel = new NewClientPanel(page)
	const newRequestPanel = new NewRequestPanel(page)
	const profilePage = new ProfilePage(page)
	const reportPage = new ReportPage(page)
	const servicesPage = new ServicesPage(page)
	const specialistsPage = new SpecialistsPage(page)
	const tagsPage = new TagsPage(page)
	const notFoundPage = new NotFoundPage(page)
	const addServicePage = new AddServicePage(page)
	return {
		clientsPage,
		dashboardPage,
		header,
		loginPage,
		logoutPage,
		newClientPanel,
		newRequestPanel,
		profilePage,
		reportPage,
		servicesPage,
		specialistsPage,
		tagsPage,
		notFoundPage,
		addServicePage,
		sequences: {
			login: async () => {
				await loginPage.open()
				await loginPage.waitForLoad()
				await loginPage.login(configuration.username, configuration.password)
				await dashboardPage.waitForLoad()
			},
			selectSpanishLanguage: async () => {
				await header.clickLanguageDropdown()
				await header.clickSpanishButton()
			},
			selectEnglishLanguage: async () => {
				await header.clickLanguageDropdown()
				await header.clickEnglishButton()
			}
		}
	}
}
