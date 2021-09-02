/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ServiceInput, ServiceResponse, StatusType } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { ServiceCollection } from '~db'
import { createDBService, createGQLService } from '~dto'
import { Interactor } from '~types'

export class CreateServiceInteractor implements Interactor<ServiceInput, ServiceResponse> {
	#localization: Localization
	#services: ServiceCollection

	public constructor(localization: Localization, services: ServiceCollection) {
		this.#localization = localization
		this.#services = services
	}

	public async execute(service: ServiceInput): Promise<ServiceResponse> {
		const newService = createDBService(service)
		if (!service.orgId) {
			return {
				service: null,
				message: this.#localization.t('mutation.createService.orgIdRequired'),
				status: StatusType.Failed
			}
		}

		await this.#services.insertItem(newService)

		return {
			service: createGQLService(newService),
			message: this.#localization.t('mutation.createService.success'),
			status: StatusType.Success
		}
	}
}
