/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import {
	MutationUpdateTagArgs,
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
import { handleGraphqlResponseSync } from '~utils/handleGraphqlResponse'

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
							const newOrg = cloneDeep(organization) as Organization
							const tagIdx = newOrg.tags.findIndex((t: Tag) => t.id === updateTag.tag.id)
							newOrg.tags[tagIdx] = updateTag.tag
							setOrg(newOrg)
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
