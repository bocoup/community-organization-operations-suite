/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { MutationUpdateTagArgs, TagInput, TagResponse } from '@cbosuite/schema/dist/client-types'
import { organizationState } from '~store'
import { useRecoilState } from 'recoil'
import type { Organization } from '@cbosuite/schema/dist/client-types'
import { TagFields } from '../fragments'
import { useToasts } from '~hooks/useToasts'
import { useTranslation } from '~hooks/useTranslation'
import { MessageResponse } from '../types'
import { useCallback } from 'react'
import { handleGraphqlResponseSync } from '~utils/handleGraphqlResponse'

const UPDATE_TAG = gql`
	${TagFields}

	mutation updateTag($tag: TagInput!) {
		updateTag(tag: $tag) {
			tag {
				...TagFields
			}
			message
		}
	}
`

export type UpdateTagCallback = (tag: TagInput) => Promise<MessageResponse>

export function useUpdateTagCallback(): UpdateTagCallback {
	const { c } = useTranslation()
	const toast = useToasts()
	const [updateExistingTag] = useMutation<any, MutationUpdateTagArgs>(UPDATE_TAG)
	const [organization, setOrg] = useRecoilState<Organization | null>(organizationState)

	return useCallback(
		async (tag: TagInput) => {
			let result: MessageResponse

			// Call the update tag grqphql mutation
			await updateExistingTag({
				variables: { tag },
				update(_cache, resp) {
					result = handleGraphqlResponseSync(resp, {
						toast,
						successToast: c('hooks.useTag.updateTag.success'),
						failureToast: c('hooks.useTag.updateTag.failed'),
						onSuccess: ({ updateTag }: { updateTag: TagResponse }) => {
							// Set the tag response in the organization
							setOrg({
								...organization,
								tags: organization.tags.map((t) => (t.id === updateTag.tag.id ? updateTag.tag : t))
							})
							return updateTag.message
						}
					})
				}
			})

			return result
		},
		[c, toast, setOrg, organization, updateExistingTag]
	)
}
