/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useEffect, useState } from 'react'
import { config } from '~utils/config'

export function useOffline() {
	const [isOffline, setIsOffline] = useState(localStorage.getItem('isOffline') === String(true))

	useEffect(() => {
		const setOffline = () => {
			setIsOffline(true)
			localStorage.setItem('isOffline', 'true')
		}

		const setOnline = () => {
			setIsOffline(false)
			localStorage.removeItem('isOffline')
		}

		window.addEventListener('offline', setOffline)
		window.addEventListener('online', setOnline)

		return () => {
			window.removeEventListener('offline', setOffline)
			window.removeEventListener('online', setOnline)
		}
	}, [setIsOffline])

	return config.site.isOffline || isOffline
}
