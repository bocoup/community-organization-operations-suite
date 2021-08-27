/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import fs from 'fs'
import path from 'path'
import copy from 'copy'
import { name, version, dependencies } from './package.json'
const DIST_PATH = path.join(__dirname, 'dist')
const PKG_JSON = path.join(DIST_PATH, 'package.json')
const INDEX_JS = path.join(DIST_PATH, 'index.js')

function copyInto(input: string, target = DIST_PATH): Promise<void> {
	return new Promise((resolve, reject) => {
		if (!fs.existsSync(target)) {
			fs.mkdirSync(target)
		}
		copy(input, target, (err, file) => {
			if (err) {
				reject(err)
			} else {
				resolve()
			}
		})
	})
}

async function execute() {
	await Promise.all([
		copyInto('package.json'),
		copyInto('config/*', path.join(DIST_PATH, 'config'))
	])

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
}

execute()
	.then(() => console.log('deploy package created'))
	.catch((err) => {
		console.error(err)
		process.exit(1)
	})
