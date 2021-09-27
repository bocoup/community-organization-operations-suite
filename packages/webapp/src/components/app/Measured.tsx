/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js'
import { Component, FC, memo, useEffect } from 'react'
import { reactPlugin } from '~utils/appinsights'
import { useLocation } from 'react-router-dom'
import { useLocationQuery } from '~hooks/useLocationQuery'

const Tracking: FC = memo(function Tracking({ children }) {
	const location = useLocation()
	const query = useLocationQuery()
	useEffect(() => {
		if (typeof location !== 'undefined') {
			const name = location.pathname
			const properties = { route: name }
			Object.keys(query).forEach((key) => {
				properties[`query.${key}`] = query[key]
			})

			reactPlugin.trackPageView({ name, properties })
		}
	}, [location, query])
	return <>{children}</>
})

export class Measured extends Component {
	public componentDidCatch(error: Error) {
		reactPlugin.trackException({ exception: error })
	}

	public render() {
		const { children } = this.props
		return (
			<AppInsightsContext.Provider value={reactPlugin}>
				<Tracking>{children}</Tracking>
			</AppInsightsContext.Provider>
		)
	}
}
