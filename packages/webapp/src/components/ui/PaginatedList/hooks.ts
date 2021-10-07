/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useEffect, useState } from 'react'
import { empty } from '~utils/noop'

export function usePageItems<T>(
	itemsPerPage: number
): (list: T[], items: T[], isListSearching: boolean) => T[] {
	// logic to handle search results less than itemsPerPage
	return function page(list: T[], items: T[], isSearching: boolean) {
		list = list || empty
		items = items || empty
		if (isSearching && items.length < itemsPerPage && list.length > 0) {
			return list
		}
		return items
	}
}

export function useOverflow(element: HTMLElement, checkDeps: any[]): boolean {
	const [overflowActive, setOverflowActive] = useState(false)
	const isOverflowActive = useCallback(() => {
		if (element) {
			return (
				element &&
				(element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth)
			)
		}
	}, [element])

	useEffect(() => {
		if (isOverflowActive()) {
			setOverflowActive(true)
		} else {
			setOverflowActive(false)
		}
		/* eslint-disable-next-line react-hooks/exhaustive-deps*/
	}, [isOverflowActive, ...checkDeps])
	return overflowActive
}
