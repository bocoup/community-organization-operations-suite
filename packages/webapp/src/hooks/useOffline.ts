/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useEffect, useState } from 'react'

export function useOffline() {
	const [isOffline, setIsOffline] = useState(false)

	useEffect(() => {
		const setOffline = () => {
			setIsOffline(true)
		}

		const setOnline = () => {
			setIsOffline(false)
		}

		window.addEventListener('offline', setOffline)
		window.addEventListener('online', setOnline)

		return () => {
			window.removeEventListener('offline', setOffline)
			window.removeEventListener('online', setOnline)
		}
	}, [])

	return isOffline
}
