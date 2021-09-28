/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { configure } = require('@essex/jest-config')
const pathsJest = require('tsconfig-paths-jest')
const crossFetch = require('cross-fetch')
const tsconfig = require('./tsconfig.json')
const nodeConf = require('config')
const config = configure()

// Resolve TSConfig Papths
const moduleNameMapper = pathsJest(tsconfig)

const jestConfig = {
	...config,
	testEnvironment: 'jsdom',
	globals: {
		__CONFIG__: nodeConf,
		fetch: crossFetch.default
	},
	moduleNameMapper: {
		...moduleNameMapper,
		'@cbosuite/schema/dist/client-types': '@cbosuite/schema/dist/client-types.test',
		'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			require.resolve('@essex/jest-config/lib/filemock'),
		'\\.(css|less|scss|sass)$': require.resolve('identity-obj-proxy')
	}
}

module.exports = jestConfig
