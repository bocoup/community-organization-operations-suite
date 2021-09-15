/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ServiceInput, ServiceResponse, StatusType } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { ServiceCollection } from '~db'
import { createDBServiceCustomFields, createGQLService } from '~dto'
import { Interactor } from '~types'

export class UpdateServiceInteractor implements Interactor<ServiceInput, ServiceResponse> {
	#localization: Localization
	#services: ServiceCollection

	public constructor(localization: Localization, services: ServiceCollection) {
		this.#localization = localization
		this.#services = services
	}

	public async execute(service: ServiceInput): Promise<ServiceResponse> {
		if (!service.serviceId) {
			return {
				service: null,
				message: this.#localization.t('mutation.updateService.serviceIdRequired'),
				status: StatusType.Failed
			}
		}

		if (!service.orgId) {
			return {
				service: null,
				message: this.#localization.t('mutation.updateService.orgIdRequired'),
				status: StatusType.Failed
			}
		}

		const result = await this.#services.itemById(service.serviceId)
		if (!result.item) {
			return {
				service: null,
				message: this.#localization.t('mutation.updateService.serviceNotFound'),
				status: StatusType.Failed
			}
		}

		const dbService = result.item

		const changedData = {
			...dbService,
			name: service.name || dbService.name,
			description: service.description || dbService.description,
			tags: service.tags || dbService.tags,
			customFields: service.customFields
				? createDBServiceCustomFields(service.customFields)
				: dbService.customFields,
			contactFormEnabled: service.contactFormEnabled
		}
		console.log(changedData)

		await this.#services.updateItem({ id: service.serviceId }, { $set: changedData })

		return {
			service: createGQLService(changedData),
			message: this.#localization.t('mutation.updateService.success'),
			status: StatusType.Success
		}
	}
}
