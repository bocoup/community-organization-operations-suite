/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { withAITracking, ReactPlugin } from '@microsoft/applicationinsights-react-js'
import { ComponentType } from 'react'

const enableDebug = process.env.APPLICATION_INSIGHTS_DEBUG as any as boolean
const instrumentationKey = process.env.APPLICATION_INSIGHTS_INSTRUMENTATION_KEY || ''
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

export function wrap<P>(component: ComponentType<P>): ComponentType<P> {
	return withAITracking(reactPlugin, component)
}
