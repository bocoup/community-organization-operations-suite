/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import fs from 'fs'
import { DbOrganization, DbUser, DbContact, DbEngagement, DbTag, DbService } from '~db/types'
import { writeCollectionData } from './writeCollectionData'
import { createOrganizationTags } from './createOrganizationTags'
import { createOrganizationUsers } from './createOrganizationUsers'
import { createOrganizationServices } from './createOrganizationServices'
import { createEngagegement } from './createEngagement'
import { attachToOrg, createOrganization } from './createOrganization'

const orgs: DbOrganization[] = []
const users: DbUser[] = []
const contacts: DbContact[] = []
const engagements: DbEngagement[] = []
const tags: DbTag[] = []
const services: DbService[] = []

const organizationNames = ['Curamericas', 'PEACH', 'IFPHA', 'TRY', 'MACHE']

organizationNames.forEach((orgName) => {
	const org: DbOrganization = createOrganization(orgName)
	const orgUsers: DbUser[] = createOrganizationUsers(org.id, orgName)
	const orgTags: DbTag[] = createOrganizationTags(org.id)
	const orgServices: DbService[] = createOrganizationServices(org.id)

	const orgContacts: DbContact[] = []
	const orgEngagements: DbEngagement[] = []
	for (let i = 0; i < 100; ++i) {
		const { contact, engagement } = createEngagegement(i, org.id, orgUsers, orgTags)
		orgEngagements.push(engagement)
		orgContacts.push(contact)
	}

	attachToOrg(org, orgUsers, orgTags, orgContacts)

	orgs.push(org)
	tags.push(...orgTags)
	users.push(...orgUsers)
	contacts.push(...orgContacts)
	services.push(...orgServices)
	engagements.push(...orgEngagements)
})

fs.mkdirSync('mock_data', { recursive: true })
writeCollectionData('organizations', orgs)
writeCollectionData('users', users)
writeCollectionData('contacts', contacts)
writeCollectionData('engagements', engagements)
writeCollectionData('tags', tags)
writeCollectionData('services', services)
