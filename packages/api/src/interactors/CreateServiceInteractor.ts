/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ServiceInput, ServiceResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { ServiceCollection } from '~db'
import { createDBService, createGQLService } from '~dto'
import { Interactor } from '~types'
import { FailedResponse, SuccessServiceResponse } from '~utils/response'

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
			return new FailedResponse(this.#localization.t('mutation.createService.orgIdRequired'))
		}

		await this.#services.insertItem(newService)

		return new SuccessServiceResponse(
			this.#localization.t('mutation.createService.success'),
			createGQLService(newService)
		)
	}
}
