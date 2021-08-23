/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import fs from 'fs'
import path from 'path'
import { name, version, dependencies } from './package.json'

const PKG_JSON = path.join(__dirname, 'dist/package.json')
const INDEX_JS = path.join(__dirname, 'dist/index.js')

const deployPackage = {
	name,
	version,
	dependencies: {
		...dependencies,
		'@cbosuite/schema': 'file:../../schema'
	},
	main: 'index.js'
}

fs.writeFileSync(PKG_JSON, JSON.stringify(deployPackage, null, 2))
fs.writeFileSync(INDEX_JS, `require('./src/index')`)
