/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { ReactPlugin } from '@microsoft/applicationinsights-react-js'

export const reactPlugin = new ReactPlugin()
export const appInsights = new ApplicationInsights({
	config: {
		enableDebug: process.env.APPLICATION_INSIGHTS_DEBUG as any as boolean,
		instrumentationKey: process.env.APPLICATION_INSIGHTS_INSTRUMENTATION_KEY,
		extensions: [reactPlugin],
		extensionConfig: {
			[reactPlugin.identifier]: {
				/* */
			}
		}
	}
})
appInsights.loadAppInsights()
