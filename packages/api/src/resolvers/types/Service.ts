/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Tag,
	Service as ServiceType,
	ServiceResolvers,
	ServiceAnswers
} from '@cbosuite/schema/dist/provider-types'
import { createGQLContact, createGQLTag } from '~dto'
import { AppContext } from '~types'

export const Service: ServiceResolvers<AppContext> = {
	tags: async (_: ServiceType, args, context) => {
		const tags: Tag[] = []
		if (!_?.tags) return tags

		const tagArr = _.tags as any as string[]
		for (const tagId of tagArr) {
			const tag = await context.collections.tags.itemById(tagId)
			if (tag?.item) {
				tags.push(createGQLTag(tag.item))
			}
		}
		return tags
	},
	answers: async (_: ServiceType, args, context) => {
		if (!_.answers) return []

		return _.answers.map(async (answer) => {
			const contactIds = answer.contacts as any[] as string[]
			const contacts = await Promise.all(
				contactIds.map(async (contactId) => {
					const contact = await context.collections.contacts.itemById(contactId)
					if (!contact.item) {
						throw new Error(`Contact ${contactId} not found`)
					}
					return createGQLContact(contact.item)
				})
			)

			return {
				id: answer.id,
				contacts,
				fieldAnswers: answer.fieldAnswers
			} as ServiceAnswers
		})
	}
}
