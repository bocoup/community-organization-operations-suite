/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useEffect } from 'react'
import { empty } from '~utils/noop'

export function useSearchHandler<T>(
	items: T[],
	onFilter: (filted: T[]) => void,
	predicate: (item: T, search: string) => boolean
) {
	items = items || empty
	useResetFilterOnDataChange(items, onFilter)
	return useCallback(
		(search: string) => {
			search = search.toLocaleLowerCase().trim()
			if (search === '') {
				onFilter(items)
			} else {
				const filteredList = items.filter((t) => !!t).filter((item: T) => predicate(item, search))
				onFilter(filteredList)
			}
		},
		[items, onFilter, predicate]
	)
}

/**
 * When transient filters are applied and the source data changes, we should
 * reset the filter state. This hook will detect when the data changes and
 * clear the applied filtering.
 *
 * @param items The data list
 * @param reset The reset function (e.g. set local state)
 */
function useResetFilterOnDataChange<T>(items: T[], reset: (items: T[]) => void) {
	useEffect(() => {
		if (items) {
			reset(items)
		}
	}, [items, reset])
}
