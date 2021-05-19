/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { LoggerOptions } from 'pino'
import { Configuration } from '~components'

export function getLoggingConfig(config: Configuration): LoggerOptions {
	return {
		prettyPrint: config.prettyLogging
			? {
					levelFirst: true,
			  }
			: undefined,
		prettifier: config.prettyLogging ? require('pino-pretty') : undefined,
	}
}
