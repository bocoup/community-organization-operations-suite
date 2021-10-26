/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationCreateServiceArgs, ServiceResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { ServiceCollection } from '~db'
import { createDBService, createGQLService } from '~dto'
import { Interactor, RequestContext } from '~types'
import { FailedResponse, SuccessServiceResponse } from '~utils/response'

export class CreateServiceInteractor
	implements Interactor<MutationCreateServiceArgs, ServiceResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly services: ServiceCollection
	) {}

	public async execute(
		{ service }: MutationCreateServiceArgs,
		{ locale }: RequestContext
	): Promise<ServiceResponse> {
		const newService = createDBService(service)
		if (!service.orgId) {
			return new FailedResponse(this.localization.t('mutation.createService.orgIdRequired', locale))
		}

		await this.services.insertItem(newService)

		return new SuccessServiceResponse(
			this.localization.t('mutation.createService.success', locale),
			createGQLService(newService)
		)
	}
}
