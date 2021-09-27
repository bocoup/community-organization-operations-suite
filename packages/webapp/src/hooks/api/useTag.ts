/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { Tag, TagInput, TagResponse } from '@cbosuite/schema/lib/client-types'
import { organizationState } from '~store'
import { useRecoilState } from 'recoil'
import type { Organization } from '@cbosuite/schema/lib/client-types'
import { cloneDeep } from 'lodash'
import { TagFields } from './fragments'
import useToasts from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'

const CREATE_NEW_TAG = gql`
	${TagFields}

	mutation createNewTag($body: OrgTagInput!) {
		createNewTag(body: $body) {
			tag {
				...TagFields
			}
			message
			status
		}
	}
`
const UPDATE_TAG = gql`
	${TagFields}

	mutation updateTag($body: OrgTagInput!) {
		updateTag(body: $body) {
			tag {
				...TagFields
			}
			message
			status
		}
	}
`

export function useTag(): {
	createTag: (orgId: string, tag: TagInput) => Promise<{ status: string; message?: string }>
	updateTag: (orgId: string, tag: TagInput) => Promise<{ status: string; message?: string }>
} {
	const [createNewTag] = useMutation(CREATE_NEW_TAG)
	const [updateExistingTag] = useMutation(UPDATE_TAG)
	const [organization, setOrg] = useRecoilState<Organization | null>(organizationState)
	const { success, failure } = useToasts()
	const { c } = useTranslation()

	const createTag = async (orgId: string, tag: TagInput) => {
		const result = {
			status: 'failed',
			message: null
		}

		// Call the create tag grqphql mutation
		try {
			await createNewTag({
				variables: { body: { orgId, tag } },
				update(cache, { data }) {
					// Get the updated response
					const createNewTagResp = data.createNewTag
					if (createNewTagResp.status === 'SUCCESS') {
						// Set the tag response in the organization
						const newOrg = cloneDeep(organization) as Organization
						newOrg.tags.push(createNewTagResp.tag)
						setOrg(newOrg)

						success(c('hooks.useTag.createTag.success'))
						result.status = 'success'
					}

					// Toast to success
					result.message = createNewTagResp.message
				}
			})
		} catch {
			// Error in graphql request
			failure(c('hooks.useTag.createTag.failed'))
		}

		return result
	}

	const updateTag = async (orgId: string, tag: TagInput) => {
		const result = {
			status: 'failed',
			message: null
		}

		// Call the update tag grqphql mutation
		try {
			await updateExistingTag({
				variables: { body: { orgId, tag } },
				update(cache, { data }) {
					// Get the updated response
					const updateTagResp = data.updateTag as TagResponse
					if (updateTagResp.status === 'SUCCESS') {
						// Set the tag response in the organization
						const newOrg = cloneDeep(organization) as Organization
						const tagIdx = newOrg.tags.findIndex((t: Tag) => t.id === updateTagResp.tag.id)
						newOrg.tags[tagIdx] = updateTagResp.tag
						setOrg(newOrg)

						// Toast to success
						success(c('hooks.useTag.updateTag.success'))

						result.status = 'success'
					}

					result.message = updateTagResp.message
				}
			})
		} catch {
			// Error in graphql request
			failure(c('hooks.useTag.updateTag.failed'))
		}

		return result
	}

	return {
		createTag,
		updateTag
	}
}
