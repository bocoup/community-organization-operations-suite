/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import fs from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'
import { v4 } from 'uuid'
import { DbOrganization, DbUser, DbContact, DbEngagement, DbTag, DbRole } from './src/db/types'
import { RoleType } from '@cbosuite/schema/lib/provider-types'
import { TagCategory } from '@cbosuite/schema/dist/provider-types'

const orgs: DbOrganization[] = []
const users: DbUser[] = []
const tags: DbTag[] = []
const contacts: DbContact[] = []
const engagements: DbEngagement[] = []

function generatePassword(length = 10): string {
	const _pattern = /[a-zA-Z0-9_\-+.]/
	return [...Array(length)]
		.map(function () {
			let result
			while (true) {
				const randomByte = Math.floor(Math.random() * 256)
				result = String.fromCharCode(randomByte)
				if (_pattern.test(result)) {
					return result
				}
			}
		})
		.join('')
}

/**
 * List of orgs to create
 */
// Example:
// const ORG_NAMES = ['Test']
const ORG_NAMES = ['Test']

/**
 * List of lists of users to create
 * Each index correlates to the index of the organization in org_names
 * Users in each org will have an org assigned to their role_type
 * and users will have their ids added to the list of users on an org
 *
 */
// Example:
// const ORG_USERS = [
// 	[
// 		{
// 			firstName: 'John',
// 			middleName: '',
// 			lastName: 'Doe',
// 			email: 'john.doe@test.com',
// 			admin: true
// 		}
// 	]
// ]
const ORG_USERS = [[]]

/**
 * Orgs are prepopulated with the following tags on creation
 * These tags will be added to the tags collection and their ids will
 * be added to organizaiton tags list
 */
const TAGS_TO_CREATE = [
	{
		label: 'Food',
		description: '',
		category: TagCategory.Sdoh
	},
	{
		label: 'Housing',
		description: '',
		category: TagCategory.Sdoh
	},
	{
		label: 'Transportation',
		description: '',
		category: TagCategory.Sdoh
	},
	{
		label: 'Interpersonal Safety',
		description: '',
		category: TagCategory.Sdoh
	},
	{
		label: 'Immediate Need',
		description: '',
		category: TagCategory.Sdoh
	}
]

// Created users to export generated users and their generated password
const createdUsers: {
	name: string
	email: string
	password: string
}[] = []

// Create users for each org
ORG_NAMES.forEach((name, orgIdx) => {
	// Create org id
	const orgId = v4()

	// Create users
	const orgUsers = ORG_USERS[orgIdx].map((user) => {
		// Create org role to assign to user
		const roles: DbRole[] = [{ org_id: orgId, role_type: RoleType.User }]
		if (user.admin) roles.push({ org_id: orgId, role_type: RoleType.Admin })

		// Create password
		const password = generatePassword()

		// Create user
		const dbUser: DbUser = {
			id: v4(),
			first_name: user.firstName,
			middle_name: user.middleName,
			last_name: user.lastName,
			user_name: `${user.firstName}.${user.lastName}`.toLowerCase(),
			password: bcrypt.hashSync(password, 10),
			email: user.email,
			roles
		}

		// Push user to users list
		users.push(dbUser)

		// Push user to created users list
		createdUsers.push({
			name: `${user.firstName} ${user.lastName}`,
			email: user.email,
			password
		})

		// Save user id to org users
		return dbUser.id
	})

	// Create tags
	const orgTags = TAGS_TO_CREATE.map((tag) => {
		// Create single tag
		const dbTag: DbTag = {
			id: v4(),
			org_id: orgId,
			...tag
		}

		// Push full tag to tags list
		tags.push(dbTag)

		// Push id to org.tags
		return dbTag.id
	})

	// Create org with users and tags
	const dbOrg: DbOrganization = {
		id: orgId,
		name,
		description: '',
		users: orgUsers,
		tags: orgTags,
		contacts: []
	}

	// Push org to orgs list
	orgs.push(dbOrg)
})

// Create json for all data
fs.mkdirSync(path.join(__dirname, 'seed_data'), { recursive: true })
const ORG_FILE = path.join(__dirname, 'seed_data', 'organizations.json')
const USERS_FILE = path.join(__dirname, 'seed_data', 'users.json')
const CREATED_USERS_FILE = path.join(__dirname, 'seed_data', 'created-users-do-not-upload.json')
const CONTACTS_FILE = path.join(__dirname, 'seed_data', 'contacts.json')
const ENGAGEMENTS_FILE = path.join(__dirname, 'seed_data', 'engagements.json')
const TAGS_FILE = path.join(__dirname, 'seed_data', 'tags.json')
const orgContent = orgs.map((o) => JSON.stringify(o)).join('\n')
const userContent = users.map((o) => JSON.stringify(o)).join('\n')
const createdUserContent = createdUsers.map((o) => JSON.stringify(o)).join('\n')
const contactContent = contacts.map((o) => JSON.stringify(o)).join('\n')
const engagementContent = engagements.map((o) => JSON.stringify(o)).join('\n')
const tagsContent = tags.map((o) => JSON.stringify(o)).join('\n')
fs.writeFileSync(ORG_FILE, orgContent, { encoding: 'utf-8' })
fs.writeFileSync(USERS_FILE, userContent, { encoding: 'utf-8' })
fs.writeFileSync(CREATED_USERS_FILE, createdUserContent, { encoding: 'utf-8' })
fs.writeFileSync(CONTACTS_FILE, contactContent, { encoding: 'utf-8' })
fs.writeFileSync(ENGAGEMENTS_FILE, engagementContent, { encoding: 'utf-8' })
fs.writeFileSync(TAGS_FILE, tagsContent, { encoding: 'utf-8' })
