/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Service, Tag } from '@cbosuite/schema/dist/client-types'
import { useSearchHandler } from './useSearchHandler'

export function useServiceSearchHandler(items: Service[], onFilter: (filted: Service[]) => void) {
	function predicate(service: Service, search: string) {
		const contains = (value: string): boolean =>
			!!value?.toLowerCase()?.includes(search?.toLowerCase())

		const inName = contains(service?.name)
		const inDescription = contains(service?.description)
		const inTags = service?.tags?.some((tag: Tag) => contains(tag.label))

		return inName || inDescription || inTags
	}

	return useSearchHandler(items, onFilter, predicate)
}
