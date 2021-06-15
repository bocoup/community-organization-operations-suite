/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Action } from '@greenlight/schema/lib/provider-types'
import type { DbAction } from '~db'

export function createGQLAction(action: DbAction, orgId: string): Action {
	return {
		__typename: 'Action',
		comment: action.comment,
		orgId,
		date: action.date,
		// These are just IDs, resolve into user objects in the resolve stack
		user: action.user_id as any,
		// These are just IDs, resolve into tag objects in the resolve stack
		tags: action.tags as any,
		// These are just IDs, resolve into user objects in the resolve stack
		taggedUser: action.tagged_user_id as any,
	}
}
