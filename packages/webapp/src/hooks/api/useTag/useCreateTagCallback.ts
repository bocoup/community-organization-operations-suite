/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { MutationCreateNewTagArgs, StatusType, TagInput } from '@cbosuite/schema/dist/client-types'
import { organizationState } from '~store'
import { useRecoilState } from 'recoil'
import type { Organization } from '@cbosuite/schema/dist/client-types'
import { cloneDeep } from 'lodash'
import { TagFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { MessageResponse } from '../types'
import { useCallback } from 'react'

const CREATE_NEW_TAG = gql`
	${TagFields}

	mutation createNewTag($tag: TagInput!) {
		createNewTag(tag: $tag) {
			tag {
				...TagFields
			}
			message
			status
		}
	}
`

export type CreateTagCallback = (tag: TagInput) => Promise<MessageResponse>

export function useCreateTagCallback(): CreateTagCallback {
	const { c } = useTranslation()
	const { success, failure } = useToasts()
	const [createNewTag] = useMutation<any, MutationCreateNewTagArgs>(CREATE_NEW_TAG)
	const [organization, setOrg] = useRecoilState<Organization | null>(organizationState)

	return useCallback(
		async (tag: TagInput) => {
			const result: MessageResponse = { status: StatusType.Failed }

			// Call the create tag grqphql mutation
			try {
				await createNewTag({
					variables: { tag },
					update(cache, { data }) {
						// Get the updated response
						const createNewTagResp = data.createNewTag
						if (createNewTagResp.status === StatusType.Success) {
							// Set the tag response in the organization
							const newOrg = cloneDeep(organization) as Organization
							newOrg.tags.push(createNewTagResp.tag)
							setOrg(newOrg)

							success(c('hooks.useTag.createTag.success'))
							result.status = StatusType.Success
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
		},
		[c, success, failure, createNewTag, organization, setOrg]
	)
}
