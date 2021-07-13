/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { Tag, TagInput, TagResponse } from '@resolve/schema/lib/client-types'
import { organizationState } from '~store'
import { useRecoilState } from 'recoil'
import type { Organization } from '@resolve/schema/lib/client-types'
import { cloneDeep } from 'lodash'
import { GET_ORGANIZATION } from './useOrganization'
import { TagFields } from './fragments'

const CREATE_NEW_TAG = gql`
	${TagFields}

	mutation createNewTag($orgId: String!, $tag: TagInput!) {
		createNewTag(orgId: $orgId, tag: $tag) {
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

	mutation updateTag($orgId: String!, $tag: TagInput!) {
		updateTag(orgId: $orgId, tag: $tag) {
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
	const [, setOrg] = useRecoilState<Organization | null>(organizationState)

	const createTag = async (orgId: string, tag: TagInput) => {
		const result = {
			status: 'failed',
			message: null
		}
		await createNewTag({
			variables: { orgId, tag },
			update(cache, { data }) {
				const createNewTagResp = data.createNewTag as TagResponse
				if (createNewTagResp.status === 'SUCCESS') {
					const existingOrgData = cache.readQuery({
						query: GET_ORGANIZATION,
						variables: { body: { orgId } }
					}) as any

					const newData = cloneDeep(existingOrgData.organization) as Organization
					newData.tags.push(createNewTagResp.tag)

					cache.writeQuery({
						query: GET_ORGANIZATION,
						variables: { body: { orgId } },
						data: { organization: newData }
					})

					setOrg(newData)

					result.status = 'success'
				}

				result.message = createNewTagResp.message
			}
		})

		return result
	}

	const updateTag = async (orgId: string, tag: TagInput) => {
		const result = {
			status: 'failed',
			message: null
		}
		await updateExistingTag({
			variables: { orgId, tag },
			update(cache, { data }) {
				const updateTagResp = data.updateTag as TagResponse
				if (updateTagResp.status === 'SUCCESS') {
					const existingOrgData = cache.readQuery({
						query: GET_ORGANIZATION,
						variables: { body: { orgId } }
					}) as any

					const newData = cloneDeep(existingOrgData.organization) as Organization
					const tagIdx = newData.tags.findIndex((t: Tag) => t.id === updateTagResp.tag.id)
					newData.tags[tagIdx] = updateTagResp.tag

					cache.writeQuery({
						query: GET_ORGANIZATION,
						variables: { body: { orgId } },
						data: { organization: newData }
					})

					setOrg(newData)

					result.status = 'success'
				}

				result.message = updateTagResp.message
			}
		})

		return result
	}

	return {
		createTag,
		updateTag
	}
}
