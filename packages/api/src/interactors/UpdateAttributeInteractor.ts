/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AttributeInput, AttributeResponse, StatusType } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { OrganizationCollection } from '~db'
import { Interactor } from '~types'

export class UpdateAttributeInteractor implements Interactor<AttributeInput, AttributeResponse> {
	#localization: Localization
	#orgs: OrganizationCollection

	public constructor(localization: Localization, orgs: OrganizationCollection) {
		this.#localization = localization
		this.#orgs = orgs
	}

	public async execute(attribute: AttributeInput): Promise<AttributeResponse> {
		if (!attribute.id) {
			return {
				attribute: null,
				message: this.#localization.t('mutation.updateAttribute.attributeIdRequired'),
				status: StatusType.Failed
			}
		}

		if (!attribute.orgId) {
			return {
				attribute: null,
				message: this.#localization.t('mutation.updateAttribute.orgIdRequired'),
				status: StatusType.Failed
			}
		}

		await this.#orgs.updateItem(
			{ id: attribute.orgId, 'attributes.id': attribute.id },
			{
				$set: {
					'attributes.$.label': attribute.label,
					'attributes.$.description': attribute.description
				}
			}
		)

		return {
			attribute: {
				id: attribute.id || '',
				label: attribute.label || '',
				description: attribute.description || ''
			},
			message: this.#localization.t('mutation.updateAttribute.success'),
			status: StatusType.Success
		}
	}
}
