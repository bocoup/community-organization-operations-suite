/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { withAITracking, ReactPlugin } from '@microsoft/applicationinsights-react-js'
import { ComponentType } from 'react'
import config from '~utils/config'

const enableDebug = config.applicationInsights.debug || false
const instrumentationKey = config.applicationInsights.key || ''
const disableTelemetry = !instrumentationKey

export const reactPlugin = new ReactPlugin()
export const appInsights = new ApplicationInsights({
	config: {
		enableDebug,
		disableTelemetry,
		instrumentationKey,
		extensions: [reactPlugin],
		extensionConfig: {
			[reactPlugin.identifier]: {
				/* */
			}
		}
	}
})
appInsights.loadAppInsights()

export function wrap<T extends ComponentType<unknown>>(component: T): T {
	return withAITracking(reactPlugin, component) as any as T
}

export function isTelemetryEnabled() {
	return !disableTelemetry
}
