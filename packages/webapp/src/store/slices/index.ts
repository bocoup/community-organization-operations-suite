/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import authReducer from './authSlice'
import myRequestsReducer from './myRequestsSlice'
import navigatorsReducer from './navigatorsSlice'
import requestReducer from './requestSlice'
import requestsReducer from './requestsSlice'

const rootReducer = {
	auth: authReducer,
	requests: requestsReducer,
	myRequests: myRequestsReducer,
	navigators: navigatorsReducer,
	request: requestReducer
}

export default rootReducer
