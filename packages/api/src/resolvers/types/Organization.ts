/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Contact,
	Organization as OrganizationType,
	OrganizationResolvers,
	Tag
} from '@resolve/schema/lib/provider-types'
import { DbUser, DbContact } from '~db'
import { createGQLContact, createGQLUser } from '~dto'
import { sortByProp } from '~utils'
import { AppContext } from '~types'

export const Organization: OrganizationResolvers<AppContext> = {
	users: async (_: OrganizationType, args, context) => {
		const userIds = _.users as any as string[]
		const users = await Promise.all(
			userIds.map((userId) => context.collections.users.itemById(userId))
		)
		const found: any = users.map((u) => u.item).filter((t) => !!t) as DbUser[]

		const [active, closed] = await Promise.all([
			(await Promise.all(
				found.map((u: DbUser) =>
					context.collections.engagements.count({
						user_id: u.id,
						status: { $ne: 'CLOSED' }
					})
				)
			)) as number[],
			(await Promise.all(
				found.map((u: DbUser) =>
					context.collections.engagements.count({
						user_id: u.id,
						status: { $eq: 'CLOSED' }
					})
				)
			)) as number[]
		])

		return found.map((u: DbUser, index: number) =>
			createGQLUser(u, { active: active[index], closed: closed[index] })
		)
	},
	contacts: async (_: OrganizationType, args, context) => {
		const contactIds = _.contacts as any as string[]

		if (!contactIds || contactIds.length === 0) {
			return []
		}

		const contacts = await Promise.all(
			contactIds.map((contactId) => context.collections.contacts.itemById(contactId))
		)
		const found = contacts.map((c) => c.item).filter((t) => !!t) as DbContact[]
		return found
			.map((c) => createGQLContact(c))
			.sort((a: Contact, b: Contact) => (a.name.first > b.name.first ? 1 : -1))
	},
	tags: async (_: OrganizationType, args, context) => {
		const tags = _.tags as any as Tag[]

		if (!tags || tags.length === 0) {
			return []
		}

		const [engagement, actions] = await Promise.all([
			(await Promise.all(
				tags.map((tag) =>
					context.collections.engagements.count({
						org_id: { $eq: _.id },
						tags: { $eq: tag.id }
					})
				)
			)) as number[],
			(await Promise.all(
				tags.map((tag) =>
					context.collections.engagements.count({
						org_id: { $eq: _.id },
						'actions.tags': { $eq: tag.id }
					})
				)
			)) as number[]
		])

		const newTags = tags.map((tag: Tag, idx: number) => {
			return {
				...tag,
				usageCount: {
					engagement: engagement[idx],
					actions: actions[idx]
				}
			}
		})

		return sortByProp(newTags, 'label')
	}
}
