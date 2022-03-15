/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { EngagementStatus } from '@cbosuite/schema/dist/provider-types'
import faker from 'faker'
import { v4 } from 'uuid'
import { DbContact, DbEngagement, DbAction, DbUser, DbTag } from '~db/types'
import { daysAgo, sometimeLater } from './dates'
import { createFakeAddress, createFakeName } from './fakes'
import { pickRandomItem } from './pickRandomItem'
import _ from 'lodash'
import { createAuditFields } from '~dto/createAuditFields'

export interface CreateEngagementResult {
	contact: DbContact
	engagement: DbEngagement
}

export function createEngagegement(
	i: number,
	orgId: string,
	orgUsers: DbUser[],
	orgTags: DbTag[]
): CreateEngagementResult {
	const actions: DbAction[] = []
	for (let j = 0; j < 5; j++) {
		actions.push({
			date: daysAgo(1).toISOString(),
			comment: faker.lorem.paragraphs(3, '\n\n'),
			user_id: faker.random.arrayElement(orgUsers).id,
			org_id: orgId,
			tags: [pickRandomItem(orgTags).id]
		})
	}

	const fakeAddress = createFakeAddress()
	const fakeName = createFakeName()
	const dateOfBirth = daysAgo(365 * 35)

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
		address: fakeAddress,
		...createAuditFields()
	}
	// const engagementTagId = Math.floor(Math.random() * orgTags.length)

	const assignUser = Math.random() < 0.45
	const randomUser = pickRandomItem(orgUsers) as DbUser

	const engagement: DbEngagement = {
		id: v4(),
		title: _.truncate(pickRandomItem(engagementBlurbs), { length: 40 }),
		org_id: orgId,
		contacts: [contact.id],
		start_date: daysAgo(1).toISOString(),
		end_date: sometimeLater().toISOString(),
		description: pickRandomItem(engagementBlurbs),
		status: pickRandomItem(engagementStatusList),
		// [Math.floor(Math.random() * engagementStatusList.length)],
		tags: [pickRandomItem(orgTags).id],
		user_id: assignUser ? randomUser.id : undefined,
		actions: assignUser ? actions : [],
		...createAuditFields()
	}

	return { engagement, contact }
}

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

const genders = ['male', 'female', 'other']
