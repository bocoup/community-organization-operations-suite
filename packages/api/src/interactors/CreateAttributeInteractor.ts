/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AttributeInput, AttributeResponse, StatusType } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { OrganizationCollection } from '~db'
import { createDBAttribute } from '~dto/createDBAttribute'
import { Interactor } from '~types'

export class CreateAttributeInteractor implements Interactor<AttributeInput, AttributeResponse> {
	#localization: Localization
	#orgs: OrganizationCollection

	public constructor(localization: Localization, orgs: OrganizationCollection) {
		this.#localization = localization
		this.#orgs = orgs
	}

	public async execute(attribute: AttributeInput): Promise<AttributeResponse> {
		const newAttribute = createDBAttribute(attribute)
		if (!attribute.orgId) {
			return {
				attribute: null,
				message: this.#localization.t('mutation.createAttribute.orgIdRequired'),
				status: StatusType.Failed
			}
		}

		await this.#orgs.updateItem({ id: attribute.orgId }, { $push: { attributes: newAttribute } })

		return {
			attribute: newAttribute,
			message: this.#localization.t('mutation.createAttribute.success'),
			status: StatusType.Success
		}
	}
}
