/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation, useQuery } from '@apollo/client'
import { TagInput } from '@greenlight/schema/lib/client-types'
import { organizationState } from '~store'
import { useRecoilState } from 'recoil'
import type { Organization } from '@greenlight/schema/lib/client-types'
import { cloneDeep } from 'lodash'
import { GET_ORGANIZATION } from './useOrganization'

const CREATE_NEW_TAG = gql`
	mutation createNewTag($orgId: String!, $tag: TagInput!) {
		createNewTag(orgId: $orgId, tag: $tag) {
			tag {
				id
				label
				description
			}
			message
		}
	}
`

export type SetCreateTagCallback = (
	orgId: string,
	tag: TagInput
) => Promise<{ status: string; message?: string }>

export function useTag(): {
	createTag: SetCreateTagCallback
} {
	const [createNewTag] = useMutation(CREATE_NEW_TAG)
	const [, setOrg] = useRecoilState<Organization | null>(organizationState)

	const createTag = async (orgId: string, tag: TagInput) => {
		const result = {
			status: 'failed',
			message: null
		}
		await createNewTag({
			variables: { orgId, tag },
			update(cache, { data }) {
				if (data.createNewTag.message.toLowerCase() === 'success') {
					const existingOrgData = cache.readQuery({
						query: GET_ORGANIZATION,
						variables: { orgId }
					}) as any

					const newData = cloneDeep(existingOrgData.organization) as Organization
					newData.tags.push(data.createNewTag.tag)

					cache.writeQuery({
						query: GET_ORGANIZATION,
						variables: { orgId },
						data: { organization: newData }
					})

					setOrg(newData)

					result.status = 'success'
				}

				result.message = data.createNewTag.message
			}
		})

		return result
	}

	return {
		createTag
	}
}
