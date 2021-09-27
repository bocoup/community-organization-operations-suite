/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { FC, memo } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Account from '~pages/account'
import Clients from '~pages/clients'
import Login from '~pages/login'
import Logout from '~pages/logout'
import PasswordReset from '~pages/passwordReset'

export const Routes: FC = memo(function Routes() {
	return (
		<Router>
			<Switch>
				<Route path='/account' component={Account} />
				<Route path='/clients' component={Clients} />
				<Route path='/login' component={Login} />
				<Route path='/logout' component={Logout} />
				<Route path='/passwordReset' component={PasswordReset} />
			</Switch>
		</Router>
	)
})
