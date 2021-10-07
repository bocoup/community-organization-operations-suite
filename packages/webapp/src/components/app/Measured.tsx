/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js'
import { Component, FC, memo, ReactNode, useEffect } from 'react'
import { reactPlugin, isTelemetryEnabled } from '~utils/appinsights'
import { useLocation } from 'react-router-dom'
import Redbox from 'redbox-react'
import { useLocationQuery } from '~hooks/useLocationQuery'
import { createLogger } from '~utils/createLogger'
import { config } from '~utils/config'
const logger = createLogger('measured')

const Tracking: FC = memo(function Tracking({ children }) {
	const location = useLocation()
	const query = useLocationQuery()
	useEffect(() => {
		if (isTelemetryEnabled()) {
			if (typeof location !== 'undefined') {
				const name = location.pathname
				const properties = { route: name }
				Object.keys(query).forEach((key) => {
					properties[`query.${key}`] = query[key]
				})

				reactPlugin.trackPageView({ name, properties })
			}
		}
	}, [location, query])
	return <>{children}</>
})

export class Measured extends Component<{ children: ReactNode }, { error?: Error }> {
	public state: { error?: Error } = {}

	public componentDidCatch(error: Error) {
		logger(`caught error`, error)
		if (isTelemetryEnabled()) {
			reactPlugin.trackException({ exception: error })
		}
	}

	public static getDerivedStateFromError(error: Error) {
		return { error }
	}

	public render() {
		const { children } = this.props
		const { error } = this.state
		if (error && config.features.redbox.enabled) {
			if (config.features.redbox.behavior === 'text-only') {
				return <div className='errorMessage'>{`${error.message}\n\n${error.stack}`}</div>
			} else {
				return <Redbox error={error} />
			}
		}
		return (
			<AppInsightsContext.Provider value={reactPlugin}>
				<Tracking>{children}</Tracking>
			</AppInsightsContext.Provider>
		)
	}
}
