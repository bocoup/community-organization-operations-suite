/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await,jest/expect-expect,jest/no-disabled-tests */
import {
	mount,
	login,
	logout,
	navigateClients,
	navigateDashboard,
	navigateReporting,
	navigateServices,
	navigateSpecialists,
	navigateTags
} from './sequences'
import {
	setupNetworkIntercepts,
	teardownNetworkIntercepts,
	setupReactRoot,
	teardownReactRoot
} from './scaffolding'
const ITEST_TIMEOUT = 30000

describe('The CBOSuite App', () => {
	let container: HTMLDivElement

	beforeEach(async () => {
		// Set up React Host
		localStorage.clear()
		container = setupReactRoot()
		setupNetworkIntercepts()
		await mount(container)
	})
	afterEach(() => {
		localStorage.clear()
		container = teardownReactRoot(container)
		teardownNetworkIntercepts()
		jest.clearAllMocks()
	})

	it(
		'can go through login/logout flow',
		async () => {
			await login()
			await logout()
		},
		ITEST_TIMEOUT
	)

	it(
		'can navigate to dashboard (/)',
		async () => {
			await login()
			await navigateDashboard()
		},
		ITEST_TIMEOUT
	)

	it(
		'can navigate to /specialist',
		async () => {
			await login()
			await navigateSpecialists()
		},
		ITEST_TIMEOUT
	)

	it(
		'can navigate to /clients',
		async () => {
			await login()
			await navigateClients()
		},
		ITEST_TIMEOUT
	)

	it(
		'can navigate to /tags',
		async () => {
			await login()
			await navigateTags()
		},
		ITEST_TIMEOUT
	)

	it(
		'can navigate to /reporting',
		async () => {
			await login()
			await navigateReporting()
		},
		ITEST_TIMEOUT
	)

	it(
		'can navigate to /services',
		async () => {
			await login()
			await navigateServices()
		},
		ITEST_TIMEOUT
	)
})
