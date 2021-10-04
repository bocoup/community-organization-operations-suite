/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable no-console */
import fs from 'fs'
import os from 'os'

const input = process.argv[2]
if (input == null) {
	throw new Error(`path to firebase config must be provided`)
}
const filename = input.replace(/^~/, os.homedir())
const cert = fs.readFileSync(filename, 'utf8')

function convertToBase64(text) {
	const buff = Buffer.from(JSON.stringify(text), 'utf8')
	return buff.toString('base64')
}
console.log(convertToBase64(cert))
