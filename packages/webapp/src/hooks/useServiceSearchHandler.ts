/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Service, Tag } from '@cbosuite/schema/dist/client-types'
import { useSearchHandler } from './useSearchHandler'

export function useServiceSearchHandler(items: Service[], onFilter: (filted: Service[]) => void) {
	return useSearchHandler(
		items,
		onFilter,
		(s: Service, search: string) =>
			s.name.toLowerCase().includes(search.toLowerCase()) ||
			s.description.toLowerCase().includes(search.toLowerCase()) ||
			s.tags?.some((t: Tag) => t.label.toLowerCase().includes(search.toLowerCase()))
	)
}
