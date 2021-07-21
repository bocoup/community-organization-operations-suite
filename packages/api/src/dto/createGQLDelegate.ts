/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { createGQLName } from './createGQLName'
import type { Delegate } from '@resolve/schema/lib/provider-types'
import type { DbOrganization, DbUser } from '~db'

export function createGQLDelegate(user: DbUser, org: DbOrganization[]): Delegate {
	return {
		__typename: 'Delegate',
		oid: user._id,
		id: user.id,
		name: createGQLName({
			first: user.first_name,
			middle: user.middle_name,
			last: user.last_name
		}),
		email: user.email,
		organizations: org.map((o) => {
			return {
				__typename: 'DelegateOrganization',
				id: o.id,
				name: o.name,
				description: o.description
			}
		})
	}
}
