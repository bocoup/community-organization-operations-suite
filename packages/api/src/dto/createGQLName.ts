/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Name } from '@community-organization-operations-suite/schema/lib/provider-types'

export function createGQLName({ first, middle, last }: Name): Name {
	return {
		__typename: 'Name',
		first,
		middle,
		last
	}
}
