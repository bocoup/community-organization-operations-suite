/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Name } from '@greenlight/schema/lib/provider-types'

export function createGQLName(
	first: string,
	middle: string,
	last: string
): Name {
	return {
		__typename: 'Name',
		first,
		middle,
		last,
	}
}
