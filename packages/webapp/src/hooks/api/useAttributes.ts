/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { Attribute, AttributeInput, AttributeResponse } from '@cbosuite/schema/lib/client-types'
import { organizationState } from '~store'
import { useRecoilState } from 'recoil'
import type { Organization } from '@cbosuite/schema/lib/client-types'
import { cloneDeep } from 'lodash'
import { AttributeFields } from './fragments'

const CREATE_NEW_ATTRIBUTE = gql`
	${AttributeFields}

	mutation createAttribute($body: AttributeInput!) {
		createAttribute(body: $body) {
			attribute {
				...AttributeFields
			}
			message
			status
		}
	}
`

const UPDATE_ATTRIBUTE = gql`
	${AttributeFields}

	mutation updateAttribute($body: AttributeInput!) {
		updateAttribute(body: $body) {
			attribute {
				...AttributeFields
			}
			message
			status
		}
	}
`

interface useAttributesReturn {
	attributes: Attribute[]
	createAttribute: (attribute: AttributeInput) => Promise<{ status: string; message?: string }>
	updateAttribute: (attribute: AttributeInput) => Promise<{ status: string; message?: string }>
}

export function useAttributes(): useAttributesReturn {
	const [createNewAttributeGQL] = useMutation(CREATE_NEW_ATTRIBUTE)
	const [updateAttributeGQL] = useMutation(UPDATE_ATTRIBUTE)
	const [organization, setOrg] = useRecoilState<Organization | null>(organizationState)

	const createAttribute = async (attribute: AttributeInput) => {
		const result = {
			status: 'failed',
			message: null
		}
		await createNewAttributeGQL({
			variables: { body: attribute },
			update(cache, { data }) {
				const createAttributeResp = data.createAttribute as AttributeResponse
				if (createAttributeResp.status === 'SUCCESS') {
					const newData: Attribute[] = organization?.attributes
						? cloneDeep(organization.attributes)
						: []
					newData.push(createAttributeResp.attribute)

					setOrg({ ...organization, attributes: newData })

					result.status = 'success'
				}

				result.message = createAttributeResp.message
			}
		})

		return result
	}

	const updateAttribute = async (attribute: AttributeInput) => {
		const result = {
			status: 'failed',
			message: null
		}
		await updateAttributeGQL({
			variables: { body: attribute },
			update(cache, { data }) {
				const updateAttributeResp = data.updateAttribute as AttributeResponse
				if (updateAttributeResp.status === 'SUCCESS') {
					const newData = cloneDeep(organization.attributes) as Attribute[]

					const attributeIdx = newData.findIndex((a: Attribute) => {
						return a.id === updateAttributeResp.attribute.id
					})
					newData[attributeIdx] = updateAttributeResp.attribute
					setOrg({ ...organization, attributes: newData })

					result.status = 'success'
				}

				result.message = updateAttributeResp.message
			}
		})

		return result
	}

	return {
		createAttribute,
		updateAttribute,
		attributes: organization?.attributes
	}
}