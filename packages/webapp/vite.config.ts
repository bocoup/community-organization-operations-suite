/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import path from 'path'
import essexConfig from '@essex/vite-config'
import { defineConfig } from 'vite'
require('dotenv').config()
/* eslint-disable no-var */
var config = require('config')
var appConfig = config.util.toObject(config)
console.log('App Config', appConfig)

export default defineConfig({
	...essexConfig,
	server: {
		fs: {
			strict: false
		},
		allow: ['../../']
	},
	define: {
		__CONFIG__: JSON.stringify(appConfig)
	},
	resolve: {
		alias: {
			'~styles': path.resolve(__dirname, 'src/styles'),
			'~bootstrap': 'bootstrap'
		}
	}
})
