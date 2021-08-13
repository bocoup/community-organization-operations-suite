/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ActionInput } from '@community-organization-operations-suite/schema/lib/provider-types'
import type { DbAction } from '~db'

export function createDBAction(action: ActionInput): DbAction {
	return {
		comment: action.comment,
		user_id: action.userId,
		org_id: action.orgId,
		date: new Date().toISOString(),
		tagged_user_id: action.taggedUserId as string,
		tags: action?.tags as string[]
	}
}
