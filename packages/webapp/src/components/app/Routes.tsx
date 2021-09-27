/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { FC, memo } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Index from '~pages/index'
import Account from '~pages/account'
import Clients from '~pages/clients'
import Login from '~pages/login'
import Logout from '~pages/logout'
import PasswordReset from '~pages/passwordReset'
import ServicesIndex from '~pages/services'
import AddService from '~pages/services/addService'
import EditService from '~pages/services/editService'
import ServiceKiosk from '~pages/services/serviceKiosk'

export const Routes: FC = memo(function Routes() {
	return (
		<Router>
			<Switch>
				<Route exact path='/' component={Index} />
				<Route path='/account' component={Account} />
				<Route path='/clients' component={Clients} />
				<Route path='/login' component={Login} />
				<Route path='/logout' component={Logout} />
				<Route path='/passwordReset' component={PasswordReset} />
				<Route path='/services' component={ServicesIndex} />
				<Route path='/services/addService' component={AddService} />
				<Route path='/services/editService' component={EditService} />
				<Route path='/services/serviceKiosk' component={ServiceKiosk} />
			</Switch>
		</Router>
	)
})
