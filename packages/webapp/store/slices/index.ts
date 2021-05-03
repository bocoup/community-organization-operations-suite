import authReducer from './auth'
import myRequestsReducer from './myRequests'
import navigatorsReducer from './navigators'
import requestReducer from './request'

export default {
	auth: authReducer,
	myRequests: myRequestsReducer,
	navigators: navigatorsReducer,
	request: requestReducer
}
