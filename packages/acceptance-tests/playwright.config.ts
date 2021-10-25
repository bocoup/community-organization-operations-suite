/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PlaywrightTestConfig } from '@playwright/test'
import config from 'config'
import path from 'path'

const playwrightConfiguration: PlaywrightTestConfig = {
	workers: config.get('workers') ?? undefined,
	timeout: config.get('timeout') ?? 30000,
	use: {
		ignoreHTTPSErrors: true,
		headless: config.get('headless'),
		video: config.get('video') ?? undefined,
		trace: config.get('trace') ?? undefined
	},
	outputDir: path.join(__dirname, 'test-results')
}
export default playwrightConfiguration
