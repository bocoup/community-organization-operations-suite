/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import pino, { Logger } from 'pino'
import { Configuration } from '~components'

export function getLogger(config: Configuration): Logger {
	return pino({
		prettyPrint: config.prettyLogging
			? {
					levelFirst: true,
			  }
			: undefined,
		prettifier: config.prettyLogging ? require('pino-pretty') : undefined,
	})
}
