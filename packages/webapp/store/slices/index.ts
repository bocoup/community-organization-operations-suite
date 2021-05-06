/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import authReducer from './authSlice'
import myRequestsReducer from './myRequestsSlice'
import navigatorsReducer from './navigatorsSlice'
import requestReducer from './requestSlice'

const rootReducer = {
	auth: authReducer,
	myRequests: myRequestsReducer,
	navigators: navigatorsReducer,
	request: requestReducer
}

export default rootReducer
