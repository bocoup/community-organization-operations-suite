/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { getLocationQuery } from '~utils/getLocationQuery'

export function useLocationQuery(): Record<string, string> {
	const location = useLocation()
	return useMemo(() => getLocationQuery(location.search), [location.search])
}
