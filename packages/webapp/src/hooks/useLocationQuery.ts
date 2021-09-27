/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export function useLocationQuery(): Record<string, string> {
	const location = useLocation()
	return useMemo<Record<string, string>>(() => {
		const search = new URLSearchParams(location.search)
		const result: Record<string, any> = {}
		const keys = search.keys()
		let next = keys.next()
		do {
			result[next.value] = search.get(next.value)
			next = keys.next()
		} while (!next.done)
		return result
	}, [location.search])
}
