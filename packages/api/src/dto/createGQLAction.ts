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
		user: action.user_id as any,
		orgId,
		date: action.date,
	}
}
