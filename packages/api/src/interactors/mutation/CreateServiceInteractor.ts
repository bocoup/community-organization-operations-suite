/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationCreateServiceArgs, ServiceResponse } from '@cbosuite/schema/dist/provider-types'
import { UserInputError, ForbiddenError } from 'apollo-server-errors'
import { createDBService, createGQLService } from '~dto'
import { Interactor, RequestContext } from '~types'
import { SuccessServiceResponse } from '~utils/response'
import { singleton } from 'tsyringe'
import { Localization } from '~components/Localization'
import { ServiceCollection } from '~db/ServiceCollection'
import { Telemetry } from '~components/Telemetry'

@singleton()
export class CreateServiceInteractor
	implements Interactor<unknown, MutationCreateServiceArgs, ServiceResponse>
{
	public constructor(
		private localization: Localization,
		private services: ServiceCollection,
		private telemetry: Telemetry
	) {}

	public async execute(
		_: unknown,
		{ service }: MutationCreateServiceArgs,
		{ locale, identity }: RequestContext
	): Promise<ServiceResponse> {
		if (!identity?.id) throw new ForbiddenError('not authenticated')

		const newService = createDBService(service, identity.id)
		if (!service.orgId) {
			throw new UserInputError(this.localization.t('mutation.createService.orgIdRequired', locale))
		}

		await this.services.insertItem(newService)

		this.telemetry.trackEvent('CreateService')
		return new SuccessServiceResponse(
			this.localization.t('mutation.createService.success', locale),
			createGQLService(newService)
		)
	}
}
