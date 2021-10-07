/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Engagement } from '@cbosuite/schema/dist/client-types'
import { useCallback } from 'react'

export function useEngagementSearchHandler(
	items: Engagement[],
	onFilter: (filted: Engagement[]) => void
) {
	return useCallback(
		(searchStr: string) => {
			if (searchStr === '') {
				onFilter(items)
			} else {
				const filteredEngagementList = items.filter(
					(engagement: Engagement) =>
						engagement.contacts.some((contact) =>
							contact.name.first.toLowerCase().includes(searchStr.toLowerCase())
						) ||
						engagement.contacts.some((contact) =>
							contact.name.last.toLowerCase().includes(searchStr.toLowerCase())
						) ||
						engagement.title.toLowerCase().includes(searchStr.toLowerCase())
				)
				onFilter(filteredEngagementList)
			}
		},
		[items, onFilter]
	)
}
