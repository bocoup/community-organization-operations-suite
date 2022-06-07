/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'
import config from 'config'

const playwrightConfiguration: PlaywrightTestConfig = {
	workers: config.get('workers') ?? undefined,
	timeout: config.get('timeout') ?? 30000,
	retries: config.get('retries') ?? undefined,
	use: {
		ignoreHTTPSErrors: true,
		headless: config.get('headless'),
		video: config.get('video') ?? undefined,
		trace: config.get('trace') ?? undefined
	},
	outputDir: './test-results',
	testDir: './test/specs',

	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,

	/* Configure projects for major browsers */
	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome']
			}
		},

		{
			name: 'firefox',
			use: {
				...devices['Desktop Firefox']
			}
		},

		{
			name: 'webkit',
			use: {
				...devices['Desktop Safari']
			}
		}
	]
}
export default playwrightConfiguration
