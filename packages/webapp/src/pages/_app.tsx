/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable no-restricted-globals */
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js'
import NextApp from 'next/app'
import { reactPlugin } from '~utils/appinsights'
import '~styles/bootstrap.custom.scss'
import '~styles/App_reset_styles.scss'
import { Progressive } from '~components/app/Progressive'
import { Stateful } from '~components/app/Stateful'
import { Localized } from '~components/app/Localized'
import { Frameworked } from '~components/app/Frameworked'

export default class App extends NextApp {
	public componentDidCatch(error: Error) {
		reactPlugin.trackException({ exception: error })
	}

	public render() {
		this.trackPageView()
		const { pageProps, Component } = this.props
		return (
			<AppInsightsContext.Provider value={reactPlugin}>
				<Stateful>
					<Progressive>
						<Localized>
							<Frameworked>
								<Component {...pageProps} />
							</Frameworked>
						</Localized>
					</Progressive>
				</Stateful>
			</AppInsightsContext.Provider>
		)
	}

	private trackPageView() {
		if (typeof location !== 'undefined') {
			const name =
				this.props.Component.displayName || this.props.Component.name || location.pathname
			const properties = {
				route: this.props.router.route
			}
			if (this.props.router.query) {
				for (const key in this.props.router.query) {
					properties[`query.${key}`] = this.props.router.query[key]
				}
			}
			reactPlugin.trackPageView({ name, properties })
		}
	}
}
