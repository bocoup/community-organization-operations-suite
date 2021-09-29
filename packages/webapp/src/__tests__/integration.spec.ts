/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await,jest/expect-expect,jest/no-disabled-tests */

import { mount } from './sequences/mount'
import { login } from './sequences/login'
import {
	navigateClients,
	navigateDashboard,
	navigateReporting,
	navigateServices,
	navigateSpecialists,
	navigateTags
} from './sequences/navigate'
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
	})
	afterEach(() => {
		localStorage.clear()
		container = teardownReactRoot(container)
		teardownNetworkIntercepts()
		jest.clearAllMocks()
	})

	it(
		'can go through login flow',
		async () => {
			await mount(container)
			await login(container)
		},
		ITEST_TIMEOUT
	)

	it(
		'can navigate to dashboard (/)',
		async () => {
			await mount(container)
			await login(container)
			await navigateDashboard(container)
		},
		ITEST_TIMEOUT
	)

	it(
		'can navigate to /specialist',
		async () => {
			await mount(container)
			await login(container)
			await navigateSpecialists(container)
		},
		ITEST_TIMEOUT
	)

	it(
		'can navigate to /clients',
		async () => {
			await mount(container)
			await login(container)
			await navigateClients(container)
		},
		ITEST_TIMEOUT
	)

	it(
		'can navigate to /tags',
		async () => {
			await mount(container)
			await login(container)
			await navigateTags(container)
		},
		ITEST_TIMEOUT
	)

	it.skip(
		'can navigate to /reporting',
		async () => {
			await mount(container)
			await login(container)
			await navigateReporting(container)
		},
		ITEST_TIMEOUT
	)

	it.skip(
		'can navigate to /services',
		async () => {
			await mount(container)
			await login(container)
			await navigateServices(container)
		},
		ITEST_TIMEOUT
	)
})
