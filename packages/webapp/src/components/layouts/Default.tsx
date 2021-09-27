/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo, useEffect } from 'react'
import CP from '~types/ComponentProps'
import Footer from '~components/ui/Footer'
import { useAuthUser } from '~hooks/api/useAuth'
import ClientOnly from '~ui/ClientOnly'
import usePushNotifications from '~hooks/usePushNotifications'
import { wrap } from '~utils/appinsights'
import { useHistory } from 'react-router-dom'

export interface DefaultLayoutProps extends CP {
	showNav?: boolean
}

const DefaultLayout = memo(function DefaultLayout({ children }: DefaultLayoutProps): JSX.Element {
	const history = useHistory()
	const { accessToken } = useAuthUser()
	const { initialize: initializePushNotifications } = usePushNotifications()

	// FIXME: resolve comments; make sure this isn't needed
	useEffect(() => {
		if (!accessToken && history.location.pathname !== '/login') {
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
			<ClientOnly>
				<Footer />
			</ClientOnly>
		</>
	)
})
export default wrap(DefaultLayout)
