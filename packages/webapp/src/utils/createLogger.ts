/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import debug from 'debug'

export function createLogger(name: string) {
	return debug(`cbosuite:${name}`)
}
