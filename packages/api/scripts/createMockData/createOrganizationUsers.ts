/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RoleType } from '@cbosuite/schema/dist/provider-types'
import faker from 'faker'
import { getEmailAddress } from './getEmailAddress'
import { hashSync } from 'bcryptjs'
import { v4 } from 'uuid'
import { DbUser } from '~db/types'
import { createAuditFields } from '~dto/createAuditFields'

export function createOrganizationUsers(orgId: string, orgName: string): DbUser[] {
	const orgUsers: DbUser[] = []
	for (let userIndex = 0; userIndex < 50; userIndex++) {
		const firstName = faker.name.firstName()
		const lastName = faker.name.lastName()

		const fakeAddress = {
			street: faker.address.streetAddress(),
			city: faker.address.city(),
			state: faker.address.stateAbbr(),
			zip: faker.address.zipCode()
		}

		orgUsers.push({
			id: v4(),
			first_name: firstName,
			middle_name: faker.name.middleName(),
			last_name: lastName,
			user_name: `${firstName}.${lastName}`.toLowerCase(),
			password: hashSync('test', 10),
			email: getEmailAddress(userIndex, orgName),
			roles: [{ org_id: orgId, role_type: RoleType.User }],
			description: `Working part-time as a ${faker.name.jobTitle()}, likes to listen to ${faker.music.genre()}.`,
			additional_info: `Completed training(s): ${faker.name.title()}, ${faker.name.title()} and ${faker.name.title()}`,
			address: fakeAddress,
			phone: faker.phone.phoneNumber(),
			...createAuditFields('seeder')
		})
	}

	// first user in every org has admin as well
	orgUsers[0].roles.push({ org_id: orgId, role_type: RoleType.Admin })
	return orgUsers
}
