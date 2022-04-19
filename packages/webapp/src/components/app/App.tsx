/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Measured } from './Measured'
import { Routes } from './Routes'
import { Stateful } from './Stateful'
import { Localized } from './Localized'
import { Frameworked } from './Frameworked'
import { Progressive } from './Progressive'
import type { FC } from 'react'
import { memo } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { config } from '~utils/config'

export const App: FC = memo(function App() {
	// Set the environment name as an attribute
	['demo', 'staging', 'integ', 'local'].forEach((env) => {
		if (config.origin.includes(env)) {
			document.documentElement?.setAttribute('data-env', env)
		}
	})

	return (
		<BrowserRouter basename='/'>
			<Measured>
				<Stateful>
					<Progressive>
						<Localized>
							<Frameworked>
								<Routes />
							</Frameworked>
						</Localized>
					</Progressive>
				</Stateful>
			</Measured>
		</BrowserRouter>
	)
})
