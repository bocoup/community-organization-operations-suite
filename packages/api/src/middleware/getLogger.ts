/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import pino, { Logger } from 'pino'
import { Configuration } from '~components/Configuration'

export function getLogger(config: Configuration): Logger {
	return pino({
		serializers: {
			err: pino.stdSerializers.err,
			error: pino.stdSerializers.err
		},
		prettyPrint: config.prettyLogging
			? {
					levelFirst: true
			  }
			: undefined,
		prettifier: config.prettyLogging ? require('pino-pretty') : undefined
	})
}
