/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import fs from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'
import faker from 'faker'
import { v4 } from 'uuid'
import {
	DbOrganization,
	DbUser,
	DbContact,
	DbAction,
	DbEngagement,
	DbTag,
	DbService
} from './src/db/types'
import {
	EngagementStatus,
	RoleType,
	ServiceStatus,
	TagCategory
} from '@cbosuite/schema/dist/provider-types'
import _ from 'lodash'

const engagementStatusList: EngagementStatus[] = [
	EngagementStatus.NotStarted,
	EngagementStatus.Open,
	EngagementStatus.Closed,
	EngagementStatus.Pending,
	EngagementStatus.Assigned,
	EngagementStatus.InProgress
]

const engagementBlurbs = [
	'Spanish translation services needed for a client who needs a home-visit vaccination due to limited mobility. Ideally the same person would be able to help make the appointment and be there for the actual appointment.',
	'Legal support request for eviction proceedings initiated due to back rent owed during COVID, despite moratorium. Willing to work through payment plan but needs help negotiating with landlord.',
	'Transportation needed to and from vaccination appointment this week from Beacon Hill to downtown. No additional accessibility needs.',
	'Food support needed for family of 4, including infant. Urgent need for formula and diapers in particular. Infant wears size 3 diapers.',
	'Transportation needed (with space for walker) for elderly client to get to vaccination appointment. Korean language skills preferred but not required.',
	'Individual requesting food support. No dietary restrictions, but limited cooking space/equipment.',
	'Legal help and notary services needed for updating name and gender marker on IDs.',
	'Eviction support needed for family given excessive late fees for rent despite eviction moratorium.',
	'Vietnamese translation services needed for client trying to schedule COVID tests for their immediate family after potential exposure.',
	'Ride needed for couple from Chinatown to downtown vaccination appointment. Must have room for crutches, either in the seat or trunk. Weekend preferred but weekday evening can work with notice.'
]

const orgs: DbOrganization[] = []
const users: DbUser[] = []
const contacts: DbContact[] = []
const engagements: DbEngagement[] = []
const tags: DbTag[] = []
const services: DbService[] = []

function randomValue(collection: any[]): any {
	return collection[Math.floor(Math.random() * collection.length)]
}

function getEmail(index: number, name: string): string {
	if (index === 0) {
		return `admin@${name}.com`.toLowerCase()
	} else {
		return `user_${index}@${name}.com`.toLowerCase()
	}
}
const ORG_NAMES = ['Curamericas', 'PEACH', 'IFPHA', 'TRY', 'MACHE']
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

const SERVICES_TO_CREATE = [
	{
		name: 'Local Food Delivery',
		serviceStatus: ServiceStatus.Active,
		contactFormEnabled: false,
		customFields: [
			{
				fieldId: v4(),
				fieldName: 'Allergens',
				fieldType: 'singleText',
				fieldValue: [],
				fieldRequirements: 'optional'
			}
		]
	},
	{
		name: 'Legal Aid',
		serviceStatus: ServiceStatus.Active,
		contactFormEnabled: true,
		customFields: [
			{
				fieldId: v4(),
				fieldName: 'Citizenship',
				fieldType: 'singleText',
				fieldValue: [],
				fieldRequirements: 'optional'
			}
		]
	}
]
ORG_NAMES.forEach((name) => {
	const orgId = v4()
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
			password: bcrypt.hashSync('test', 10),
			email: getEmail(userIndex, name),
			roles: [{ org_id: orgId, role_type: RoleType.User }],
			description: `Working part-time as a ${faker.name.jobTitle()}, likes to listen to ${faker.music.genre()}.`,
			additional_info: `Completed training(s): ${faker.name.title()}, ${faker.name.title()} and ${faker.name.title()}`,
			address: fakeAddress,
			phone: faker.phone.phoneNumber()
		})
	}

	// first user in every org has admin as well
	// orgUsers[0].first_name = 'Mike'
	// orgUsers[0].email = 'mike@email.com'
	// orgUsers[0].user_name = `Mike.${orgUsers[0].last_name}`
	orgUsers[0].roles.push({ org_id: orgId, role_type: RoleType.Admin })

	const orgTags: DbTag[] = TAGS_TO_CREATE.map((t) => ({
		...t,
		id: v4(),
		org_id: orgId
	}))
	tags.push(...orgTags)

	const orgServices: DbService[] = SERVICES_TO_CREATE.map((s) => ({
		...s,
		id: v4(),
		org_id: orgId
	}))
	services.push(...orgServices)

	const dbOrg: DbOrganization = {
		id: orgId,
		name,
		description: faker.lorem.paragraph(3),
		users: orgUsers.map((u) => u.id),
		tags: orgTags.map((t) => t.label),
		contacts: []
	}

	const twoDaysAgo = new Date()
	twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
	const yesterday = new Date()
	yesterday.setDate(yesterday.getDate() - 1)
	const dateOfBirth = new Date()
	dateOfBirth.setDate(dateOfBirth.getDate() - 35 * 365)

	const later = (daysLater?: number): string => {
		const _later = new Date()

		if (!daysLater) {
			daysLater = Math.floor(Math.random() * 14) + 1 // 1 to 14 days later
		}

		_later.setDate(_later.getDate() + daysLater)

		return _later.toISOString()
	}
	for (let i = 0; i < 100; ++i) {
		const actions: DbAction[] = []
		for (let j = 0; j < 5; j++) {
			// const actionTagId = Math.floor(Math.random() * orgTags.length)
			actions.push({
				date: yesterday.toISOString(),
				comment: faker.lorem.paragraphs(3, '\n\n'),
				user_id: faker.random.arrayElement(orgUsers).id,
				org_id: orgId,
				tags: [randomValue(orgTags).id]
			})
		}

		const fakeAddress = {
			street: faker.address.streetAddress(),
			city: faker.address.city(),
			state: faker.address.stateAbbr(),
			zip: faker.address.zipCode()
		}

		const fakeName = {
			first: faker.name.firstName(),
			middle: faker.name.middleName(),
			last: faker.name.lastName()
		}
		const genders = ['male', 'female', 'other']
		const contact: DbContact = {
			id: v4(),
			demographics: {
				gender: genders[i % genders.length],
				gender_other: '',
				ethnicity: 'undeclared',
				ethnicity_other: '',
				race: 'unknown',
				race_other: 'unknown',
				preferred_language: 'english',
				preferred_language_other: '',
				preferred_contact_method: '',
				preferred_contact_time: ''
			},
			org_id: orgId,
			first_name: fakeName.first,
			last_name: fakeName.last,
			middle_name: fakeName.middle,
			email: faker.internet.email(fakeName.first, fakeName.last).toLowerCase(),
			phone: faker.phone.phoneNumber(),
			date_of_birth: dateOfBirth.toISOString(),
			address: fakeAddress
		}
		// const engagementTagId = Math.floor(Math.random() * orgTags.length)

		const assignUser = Math.random() < 0.45
		const randomUser = randomValue(orgUsers) as DbUser

		const engagement: DbEngagement = {
			id: v4(),
			title: _.truncate(randomValue(engagementBlurbs), { length: 40 }),
			org_id: orgId,
			contacts: [contact.id],
			start_date: yesterday.toISOString(),
			end_date: later(),
			description: randomValue(engagementBlurbs),
			status: randomValue(engagementStatusList),
			// [Math.floor(Math.random() * engagementStatusList.length)],
			tags: [randomValue(orgTags).id],
			user_id: assignUser ? randomUser.id : undefined,
			actions: assignUser ? actions : []
		}

		engagements.push(engagement)
		dbOrg.contacts.push(contact.id)
		contacts.push(contact)
	}

	orgs.push(dbOrg)
	users.push(...orgUsers)
})

function writeCollection(file: string, items: unknown[]): void {
	const outputFilename = path.join(__dirname, 'mock_data', `${file}.json`)
	const content = items.map((o) => JSON.stringify(o)).join('\n')
	fs.writeFileSync(outputFilename, content, { encoding: 'utf-8' })
}

fs.mkdirSync(path.join(__dirname, 'mock_data'), { recursive: true })
writeCollection('organizations', orgs)
writeCollection('users', users)
writeCollection('contacts', contacts)
writeCollection('engagements', engagements)
writeCollection('tags', tags)
writeCollection('services', services)
