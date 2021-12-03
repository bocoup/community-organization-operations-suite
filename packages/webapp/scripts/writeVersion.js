/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable no-console */
const { exec } = require('child_process')
const { writeFileSync } = require('fs')

function getVersion() {
	return new Promise((resolve, reject) => {
		exec('git log -1 --format="%H"', (err, stdout, stderr) => {
			if (err) {
				reject(err)
			} else if (stderr) {
				reject(stderr)
			} else {
				resolve(stdout.trim())
			}
		})
	})
}

async function writeVersion() {
	const version = await getVersion()
	writeFileSync('.version.json', JSON.stringify({ version }), { encoding: 'utf8' })
}

writeVersion()
	.then(() => console.log('wrote version'))
	.catch((err) => console.error(err))
