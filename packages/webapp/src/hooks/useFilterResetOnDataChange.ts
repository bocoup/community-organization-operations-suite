/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEffect } from 'react'

/**
 * When transient filters are applied and the source data changes, we should
 * reset the filter state. This hook will detect when the data changes and
 * clear the applied filtering.
 *
 * @param items The data list
 * @param reset The reset function (e.g. set local state)
 */
export function useFilterResetOnDataChange<T>(items: T[], reset: (items: T[]) => void) {
	useEffect(() => {
		if (items) {
			reset(items)
		}
	}, [items, reset])
}
