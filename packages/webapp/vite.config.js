/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable no-console */
const path = require('path')
const essexConfig = require('@essex/vite-config')
const { defineConfig } = require('vite')
const { version } = require('./.version.json')
require('dotenv').config()
const config = require('config')
const appConfig = config.util.toObject(config)
appConfig.site.version = version
console.log('App Config', appConfig)

module.exports = defineConfig({
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
