/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import path from 'path'
import essexConfig from '@essex/vite-config'
import { defineConfig } from 'vite'

export default defineConfig({
	...essexConfig,
	resolve: {
		alias: {
			'~styles': path.resolve(__dirname, 'src/styles'),
			'~bootstrap': 'bootstrap'
		}
	}
})
