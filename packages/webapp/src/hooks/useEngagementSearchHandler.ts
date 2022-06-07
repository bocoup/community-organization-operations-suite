/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Engagement } from '@cbosuite/schema/dist/client-types'
import { useSearchHandler } from './useSearchHandler'

function contains(string: string, search: string): boolean {
	return string.toLowerCase().includes(search.toLowerCase())
}

function predicate(engagement: Engagement, search: string): boolean {
	return (
		contains(engagement.title, search) ||
		engagement.contacts.some((contact) => {
			const names = [contact.name.first, contact.name.last]
			names.some((name) => contains(name, search))
		})
	)
}

export function useEngagementSearchHandler(
	engagements: Engagement[],
	onFilter: (filted: Engagement[]) => void
) {
	return useSearchHandler(engagements, onFilter, predicate)
}
