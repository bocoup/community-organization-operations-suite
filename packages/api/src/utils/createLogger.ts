/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import debug from 'debug'

export function createLogger(ns: string, alwaysOn = false) {
	const result = debug(`cbosuite:${ns}`)
	if (alwaysOn) {
		result.enabled = true
	}
	return result
}
