/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const { configure } = require('@essex/jest-config')
const pathsJest = require('tsconfig-paths-jest')
const tsconfig = require('./tsconfig.json')

const config = configure()

// Resolve TSConfig Papths
const moduleNameMapper = pathsJest(tsconfig)
Object.keys(moduleNameMapper).forEach((key) => {
	moduleNameMapper[key] = moduleNameMapper[key].replace(
		'<rootDir>/',
		'<rootDir>/src/'
	)
})

module.exports = {
	...config,
	moduleNameMapper,
}
