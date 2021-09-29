/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { FC, memo, useEffect } from 'react'
import usePushNotifications from '~hooks/usePushNotifications'

export const PushNotifications: FC = memo(function PushNotifications() {
	const { initialize: initializePushNotifications } = usePushNotifications()
	useEffect(() => {
		initializePushNotifications()
	}, [initializePushNotifications])

	// renderless
	return null
})
