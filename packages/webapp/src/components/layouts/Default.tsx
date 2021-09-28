/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { FC, memo, useEffect } from 'react'

import Footer from '~components/ui/Footer'
import { useAuthUser } from '~hooks/api/useAuth'
import usePushNotifications from '~hooks/usePushNotifications'
import { wrap } from '~utils/appinsights'
import { useHistory } from 'react-router-dom'

const DefaultLayout: FC = memo(function DefaultLayout({ children }) {
	const history = useHistory()
	const { accessToken } = useAuthUser()
	const { initialize: initializePushNotifications } = usePushNotifications()

	// FIXME: resolve comments; make sure this isn't needed
	useEffect(() => {
		if (!accessToken && history.location.pathname.startsWith('/login')) {
			history.push('/login')
		}
	}, [accessToken, history.location.pathname, history])

	useEffect(() => {
		if (accessToken) {
			initializePushNotifications()
		}
	}, [accessToken, initializePushNotifications])

	return (
		<>
			{children}
			<Footer />
		</>
	)
})
export default wrap(DefaultLayout)
