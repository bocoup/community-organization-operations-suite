/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useEffect, useRef } from 'react'
import { empty } from '~utils/noop'
import { debounce } from 'lodash'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { trackEvent } from '~utils/appinsights'
import { useLocation } from 'react-router-dom'

export function useSearchHandler<T>(
	items: T[],
	onFilter: (filtered: T[]) => void,
	predicate: (item: T, search: string) => boolean
) {
	items = items || empty
	useResetFilterOnDataChange(items, onFilter)

	// -- Telemetry

	const { orgId } = useCurrentUser()
	const location = useLocation()

	const handleTrackEvent = () => {
		trackEvent({
			name: 'Search',
			properties: {
				'Organization ID': orgId,
				Page: location?.pathname ?? ''
			}
		})
	}

	const debounceTrackFn = useRef(
		debounce(handleTrackEvent, 1000, {
			leading: true,
			trailing: false
		})
	).current

	useEffect(() => {
		return () => {
			debounceTrackFn.cancel()
		}
	}, [debounceTrackFn])

	// -- end Telemetry

	return useCallback(
		(search: string) => {
			search = search.toLocaleLowerCase().trim()
			if (search === '') {
				onFilter(items)
			} else {
				const filteredList = items.filter((t) => !!t).filter((item: T) => predicate(item, search))
				onFilter(filteredList)
			}

			debounceTrackFn()
		},
		[items, onFilter, predicate, debounceTrackFn]
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
