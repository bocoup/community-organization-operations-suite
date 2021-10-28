/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { MutationCreateNewTagArgs, TagInput, TagResponse } from '@cbosuite/schema/dist/client-types'
import { organizationState } from '~store'
import { useRecoilState } from 'recoil'
import type { Organization } from '@cbosuite/schema/dist/client-types'
import { TagFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { MessageResponse } from '../types'
import { useCallback } from 'react'
import { handleGraphqlResponseSync } from '~utils/handleGraphqlResponse'

const CREATE_NEW_TAG = gql`
	${TagFields}

	mutation createNewTag($tag: TagInput!) {
		createNewTag(tag: $tag) {
			tag {
				...TagFields
			}
			message
		}
	}
`

export type CreateTagCallback = (tag: TagInput) => Promise<MessageResponse>

export function useCreateTagCallback(): CreateTagCallback {
	const { c } = useTranslation()
	const toast = useToasts()
	const [createNewTag] = useMutation<any, MutationCreateNewTagArgs>(CREATE_NEW_TAG)
	const [organization, setOrg] = useRecoilState<Organization | null>(organizationState)

	return useCallback(
		async (tag: TagInput) => {
			let result: MessageResponse

			// Call the create tag grqphql mutation
			await createNewTag({
				variables: { tag },
				update(_cache, resp) {
					handleGraphqlResponseSync(resp, {
						toast,
						successToast: c('hooks.useTag.createTag.success'),
						failureToast: c('hooks.useTag.createTag.failed'),
						onSuccess: ({ createNewTag }: { createNewTag: TagResponse }) => {
							// Set the tag response in the organization
							setOrg({
								...organization,
								tags: [...organization.tags, createNewTag.tag]
							})
							return createNewTag.message
						}
					})
				}
			})

			return result
		},
		[c, toast, createNewTag, organization, setOrg]
	)
}
