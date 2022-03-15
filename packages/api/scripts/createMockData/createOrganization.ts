/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DbOrganization, DbUser, DbTag, DbContact } from '~db/types'
import faker from 'faker'
import { v4 } from 'uuid'
import { createAuditFields } from '~dto/createAuditFields'

export function createOrganization(orgName: string): DbOrganization {
	const orgId = v4()
	return {
		id: orgId,
		name: orgName,
		description: faker.lorem.paragraph(3),
		users: [],
		contacts: [],
		tags: [],
		...createAuditFields()
	}
}

export function attachToOrg(
	org: DbOrganization,
	users: DbUser[],
	tags: DbTag[],
	contacts: DbContact[]
) {
	org.users = users.map((u) => u.id)
	org.tags = tags.map((t) => t.label)
	org.contacts = contacts.map((c) => c.id)
}
