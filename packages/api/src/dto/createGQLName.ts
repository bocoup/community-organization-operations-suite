/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Name } from '@cbosuite/schema/dist/provider-types'

const NAME_TYPE = 'Name'
export function createGQLName({ first, middle, last }: Name): Name {
	return {
		__typename: NAME_TYPE,
		first,
		middle,
		last
	}
}
