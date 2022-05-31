/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useEffect, useState } from 'react'
import { config } from '~utils/config'

export function useOffline() {
	const [isOffline, setIsOffline] = useState(localStorage.getItem('isOffline') === String(true))

	useEffect(() => {
		let onlineTimer: NodeJS.Timeout = null
		const onlineInterval = config.site.offlineTimerInterval || 10000

		const setOffline = () => {
			clearTimeout(onlineTimer)
			setIsOffline(true)
			localStorage.setItem('isOffline', 'true')
		}

		const setOnlineInterval = (event) => {
			if (event.detail?.instant) {
				setOnline()
			} else {
				clearTimeout(onlineTimer)
				onlineTimer = setTimeout(setOnline, onlineInterval)
			}
		}

		const setOnline = () => {
			setIsOffline(false)
			localStorage.removeItem('isOffline')
		}

		window.addEventListener('offline', setOffline)
		window.addEventListener('online', setOnlineInterval)

		return () => {
			window.removeEventListener('offline', setOffline)
			window.removeEventListener('online', setOnlineInterval)
		}
	}, [setIsOffline])

	return config.site.isOffline || isOffline
}
