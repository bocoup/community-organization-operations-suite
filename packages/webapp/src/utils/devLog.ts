/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * Log to console, but only in develeopment
 *
 * @param data any arguments that could be passed to console.log
 */
const devLog: Console['log'] = (...data) => {
	if (config.features.devLogger.enabled) {
		console.log(...data)
	}
}

export default devLog
