/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { createGQLName } from './createGQLName'
import type { Delegate } from '@resolve/schema/lib/provider-types'
import type { DbOrganization, DbUser } from '~db'

export function createGQLDelegate(
	user: DbUser,
	org: DbOrganization,
	dateAssigned: string,
	hasAccessTo: string[]
): Delegate {
	return {
		__typename: 'Delegate',
		id: user.id,
		name: createGQLName({
			first: user.first_name,
			middle: user.middle_name,
			last: user.last_name
		}),
		email: user.email,
		dateAssigned,
		hasAccessTo,
		organization: {
			__typename: 'DelegateOrganization',
			id: org.id,
			name: org.name,
			description: org.description
		}
	}
}
