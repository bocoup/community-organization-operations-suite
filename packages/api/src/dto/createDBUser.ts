/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { UserInput } from '@greenlight/schema/lib/provider-types'
import type { DbUser, DbRole } from '~db'
import { v4 as createId } from 'uuid'
import bcrypt from 'bcrypt'

export function createDBUser(user: UserInput, passphrase: string): DbUser {
	return {
		id: createId(),
		first_name: user.first,
		middle_name: user.middle || '',
		last_name: user.last,
		user_name: user.userName,
		email: user.email || '',
		phone: user.phone || '',
		password: bcrypt.hashSync(passphrase, 10),
		roles:
			user?.roles?.map((r) => {
				return {
					org_id: r.orgId,
					role_type: r.roleType,
				} as DbRole
			}) || [],
	}
}
