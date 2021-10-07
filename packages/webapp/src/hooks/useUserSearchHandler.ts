/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { User } from '@cbosuite/schema/dist/client-types'
import { useSearchHandler } from './useSearchHandler'

export function useUserSearchHandler(items: User[], onFilter: (filted: User[]) => void) {
	return useSearchHandler(
		items,
		onFilter,
		(user, search) =>
			user.name.first.toLowerCase().indexOf(search) > -1 ||
			user.name.last.toLowerCase().indexOf(search) > -1
	)
}
