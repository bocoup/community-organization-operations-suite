/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import fs from 'fs'
import path from 'path'
import { name, version, dependencies } from './package.json'

const deployPackage = {
	name,
	version,
	dependencies: {
		...dependencies,
		'@greenlight/schema': 'file:../../schema'
	},
	main: 'index.js'
}

fs.writeFileSync(path.join(__dirname, 'dist/package.json'), JSON.stringify(deployPackage, null, 2))
