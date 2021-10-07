/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Engagement } from '@cbosuite/schema/dist/client-types'
import { useSearchHandler } from './useSearchHandler'

export function useEngagementSearchHandler(
	items: Engagement[],
	onFilter: (filted: Engagement[]) => void
) {
	return useSearchHandler(
		items,
		onFilter,
		(engagement: Engagement, search: string) =>
			engagement.contacts.some((contact) =>
				contact.name.first.toLowerCase().includes(search.toLowerCase())
			) ||
			engagement.contacts.some((contact) =>
				contact.name.last.toLowerCase().includes(search.toLowerCase())
			) ||
			engagement.title.toLowerCase().includes(search.toLowerCase())
	)
}
