/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
require('dotenv').config()
const config = require('config')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')

const WORKER_DIR = path.join(__dirname, '../workers')
const OUTPUT_DIR = path.join(__dirname, '../public')

const workers = fs.readdirSync(WORKER_DIR)
workers.forEach(generateWorkerFile)

function generateWorkerFile(file) {
	if (file.endsWith('.tmpl')) {
		const content = fs.readFileSync(path.join(WORKER_DIR, file), 'utf8')
		const result = _.template(content)({
			origin: JSON.stringify(config.origin),
			firebaseConfig: JSON.stringify(
				{ ...config.firebase, fcmVapidServerKey: undefined },
				null,
				'\t'
			)
		})
		fs.writeFileSync(path.join(OUTPUT_DIR, file.replace('.tmpl', '.js')), result, {
			encoding: 'utf8'
		})
	}
}
