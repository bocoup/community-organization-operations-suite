/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Tag } from '@cbosuite/schema/dist/client-types'
import { useSearchHandler } from './useSearchHandler'

export function useTagSearchHandler(items: Tag[], onFilter: (filted: Tag[]) => void) {
	return useSearchHandler(
		items,
		onFilter,
		(tag: Tag, search: string) =>
			tag.label.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
			tag.description?.toLowerCase().indexOf(search.toLowerCase()) > -1
	)
}
