/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ServiceInput, ServiceResponse, StatusType } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { ServiceCollection } from '~db'
import { createDBServiceFields, createGQLService } from '~dto'
import { Interactor } from '~types'

export class UpdateServiceInteractor implements Interactor<ServiceInput, ServiceResponse> {
	#localization: Localization
	#services: ServiceCollection

	public constructor(localization: Localization, services: ServiceCollection) {
		this.#localization = localization
		this.#services = services
	}

	public async execute(service: ServiceInput): Promise<ServiceResponse> {
		if (!service.id) {
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

		const result = await this.#services.itemById(service.id)
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
			fields: service.fields ? createDBServiceFields(service.fields) : dbService.fields,
			contactFormEnabled: service.contactFormEnabled,
			status: service.status || dbService.status
		}

		await this.#services.updateItem({ id: service.id }, { $set: changedData })

		return {
			service: createGQLService(changedData),
			message: this.#localization.t('mutation.updateService.success'),
			status: StatusType.Success
		}
	}
}
