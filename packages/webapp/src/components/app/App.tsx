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
import { FC, memo } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

export const App: FC = memo(function App() {
	return (
		<Router>
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
		</Router>
	)
})
