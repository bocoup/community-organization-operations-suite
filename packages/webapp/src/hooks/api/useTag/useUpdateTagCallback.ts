/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import {
	MutationUpdateTagArgs,
	StatusType,
	Tag,
	TagInput,
	TagResponse
} from '@cbosuite/schema/dist/client-types'
import { organizationState } from '~store'
import { useRecoilState } from 'recoil'
import type { Organization } from '@cbosuite/schema/dist/client-types'
import { cloneDeep } from 'lodash'
import { TagFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { MessageResponse } from '../types'
import { useCallback } from 'react'

const UPDATE_TAG = gql`
	${TagFields}

	mutation updateTag($tag: TagInput!) {
		updateTag(tag: $tag) {
			tag {
				...TagFields
			}
			message
			status
		}
	}
`

export type UpdateTagCallback = (tag: TagInput) => Promise<MessageResponse>

export function useUpdateTagCallback(): UpdateTagCallback {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const [updateExistingTag] = useMutation<any, MutationUpdateTagArgs>(UPDATE_TAG)
	const [organization, setOrg] = useRecoilState<Organization | null>(organizationState)

	return useCallback(
		async (tag: TagInput) => {
			const result: MessageResponse = { status: StatusType.Failed }

			// Call the update tag grqphql mutation
			try {
				await updateExistingTag({
					variables: { tag },
					update(cache, { data }) {
						// Get the updated response
						const updateTagResp = data.updateTag as TagResponse
						if (updateTagResp.status === StatusType.Success) {
							// Set the tag response in the organization
							const newOrg = cloneDeep(organization) as Organization
							const tagIdx = newOrg.tags.findIndex((t: Tag) => t.id === updateTagResp.tag.id)
							newOrg.tags[tagIdx] = updateTagResp.tag
							setOrg(newOrg)

							// Toast to success
							success(c('hooks.useTag.updateTag.success'))

							result.status = StatusType.Success
						}

						result.message = updateTagResp.message
					}
				})
			} catch {
				// Error in graphql request
				failure(c('hooks.useTag.updateTag.failed'))
			}

			return result
		},
		[c, success, failure, setOrg, organization, updateExistingTag]
	)
}
