/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { setup, defaultClient } from 'applicationinsights'
import { singleton } from 'tsyringe'
import { Configuration } from './Configuration'
import { createLogger } from '~utils'
const logger = createLogger('telemetry')

@singleton()
export class Telemetry {
	public constructor(config: Configuration) {
		if (config.telemetryKey != null) {
			logger('initializing telemetry')
			setup(config.telemetryKey).start()
			logger('telem client present?', !!defaultClient)
		}
	}

	public trackEvent(eventName: string, properties?: Record<string, any>): void {
		defaultClient?.trackEvent({ name: eventName, properties })
	}
}
