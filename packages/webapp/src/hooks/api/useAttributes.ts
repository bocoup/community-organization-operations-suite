/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { Attribute, AttributeInput } from '@greenlight/schema/lib/client-types'
import { organizationState } from '~store'
import { useRecoilState } from 'recoil'
import type { Organization } from '@greenlight/schema/lib/client-types'
import { cloneDeep } from 'lodash'

const CREATE_NEW_ATTRIBUTE = gql`
	mutation createAttribute($attribute: AttributeInput!) {
		createAttribute(attribute: $attribute) {
			attribute {
				id
				label
				description
			}
			message
		}
	}
`

const UPDATE_ATTRIBUTE = gql`
	mutation updateAttribute($attribute: AttributeInput!) {
		updateAttribute(attribute: $attribute) {
			attribute {
				id
				label
				description
			}
			message
		}
	}
`

interface useAttributesReturn {
	attributes: Attribute[]
	orgId: string
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
			variables: { attribute },
			update(cache, { data }) {
				if (data.createAttribute.message.toLowerCase() === 'success') {
					const newData = cloneDeep(organization.attributes) as Attribute[]
					newData.push(data.createAttribute.attribute)

					setOrg({ ...organization, attributes: newData })

					result.status = 'success'
				}

				result.message = data.createAttribute.message
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
			variables: { attribute },
			update(cache, { data }) {
				if (data.updateAttribute.message.toLowerCase() === 'success') {
					const newData = cloneDeep(organization.attributes) as Attribute[]

					const attributeIdx = newData.findIndex((a: Attribute) => {
						return a.id === data.updateAttribute.attribute.id
					})
					newData[attributeIdx] = data.updateAttribute.attribute
					setOrg({ ...organization, attributes: newData })

					result.status = 'success'
				}

				result.message = data.updateAttribute.message
			}
		})

		return result
	}

	return {
		createAttribute,
		updateAttribute,
		attributes: organization?.attributes,
		orgId: organization.id
	}
}
