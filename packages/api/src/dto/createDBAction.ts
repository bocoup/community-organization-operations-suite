/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ActionInput } from '@cbosuite/schema/dist/provider-types'
import { DbAction } from '~db/types'

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
