/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import fs from 'fs'
import path from 'path'
import faker from 'faker'
import { v4 } from 'uuid'
import { DbOrganization, DbUser, DbContact, DbAction } from './src/db/types'
import bcrypt from 'bcrypt'

const orgs: DbOrganization[] = []
const users: DbUser[] = []
const contacts: DbContact[] = []

const ORG_NAMES = ['Curamericas', 'PEACH', 'IFPHA', 'TRY', 'MACHE']
ORG_NAMES.forEach((name) => {
	const orgId = v4()
	const orgUsers: DbUser[] = []
	for (let userIndex = 0; userIndex < 50; userIndex++) {
		const firstName = faker.name.firstName()
		const lastName = faker.name.lastName()
		orgUsers.push({
			id: v4(),
			first_name: firstName,
			middle_name: lastName,
			last_name: faker.name.lastName(),
			password: bcrypt.hashSync('test', 10),
			email: `${firstName}.${lastName}@${name}.com`.toLowerCase(),
			roles: [{ org_id: orgId, role_type: 'USER' }],
		})
	}
	// first user in every org has admin as well
	orgUsers[0].roles.push({ org_id: orgId, role_type: 'ADMIN' })

	const dbOrg = {
		id: orgId,
		name,
		description: faker.lorem.paragraph(3),
		users: orgUsers.map((u) => u.id),
	}

	const twoDaysAgo = new Date()
	twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
	const yesterday = new Date()
	yesterday.setDate(yesterday.getDate() - 1)

	for (let i = 0; i < 100; ++i) {
		const actions: DbAction[] = []
		for (let j = 0; j < 5; j++) {
			actions.push({
				date: yesterday.toISOString(),
				comment: faker.lorem.paragraphs(3, '\n\n'),
				user_id: faker.random.arrayElement(orgUsers).id,
			})
		}
		const contact: DbContact = {
			id: v4(),
			first_name: faker.name.firstName(),
			last_name: faker.name.lastName(),
			middle_name: faker.name.middleName(),
			engagements: [
				{
					id: v4(),
					org_id: orgId,
					start_date: yesterday.toISOString(),
					actions,
				},
			],
		}
		contacts.push(contact)
	}

	orgs.push(dbOrg)
	users.push(...orgUsers)
})

fs.mkdirSync(path.join(__dirname, 'mock_data'), { recursive: true })
const ORG_FILE = path.join(__dirname, 'mock_data', 'organizations.json')
const USERS_FILE = path.join(__dirname, 'mock_data', 'users.json')
const CONTACTS_FILE = path.join(__dirname, 'mock_data', 'contacts.json')
const orgContent = orgs.map((o) => JSON.stringify(o)).join('\n')
const userContent = users.map((o) => JSON.stringify(o)).join('\n')
const contactContent = contacts.map((o) => JSON.stringify(o)).join('\n')
fs.writeFileSync(ORG_FILE, orgContent, { encoding: 'utf-8' })
fs.writeFileSync(USERS_FILE, userContent, { encoding: 'utf-8' })
fs.writeFileSync(CONTACTS_FILE, contactContent, { encoding: 'utf-8' })
