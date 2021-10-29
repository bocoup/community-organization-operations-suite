/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationCreateServiceArgs, ServiceResponse } from '@cbosuite/schema/dist/provider-types'
import { UserInputError } from 'apollo-server-errors'
import { Localization } from '~components'
import { ServiceCollection } from '~db'
import { createDBService, createGQLService } from '~dto'
import { Interactor, RequestContext } from '~types'
import { SuccessServiceResponse } from '~utils/response'
import { defaultClient as appInsights } from 'applicationinsights'

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
			throw new UserInputError(this.localization.t('mutation.createService.orgIdRequired', locale))
		}

		await this.services.insertItem(newService)

		appInsights.trackEvent({ name: 'CreateService' })
		return new SuccessServiceResponse(
			this.localization.t('mutation.createService.success', locale),
			createGQLService(newService)
		)
	}
}
