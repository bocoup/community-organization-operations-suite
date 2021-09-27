/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import config from '~utils/config'
import { createLogger } from './createLogger'

const logger = createLogger('dev')

/**
 * Log to console, but only in develeopment
 *
 * @param data any arguments that could be passed to console.log
 */
const devLog: Console['log'] = (msg: string, ...data: any[]) => {
	if (config.features.devLogger.enabled) {
		logger(msg, ...data)
	}
}

export default devLog
