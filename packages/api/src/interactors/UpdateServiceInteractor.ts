/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationUpdateServiceArgs, ServiceResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { ServiceCollection } from '~db'
import { createDBServiceFields, createGQLService } from '~dto'
import { Interactor } from '~types'
import { FailedResponse, SuccessServiceResponse } from '~utils/response'

export class UpdateServiceInteractor
	implements Interactor<MutationUpdateServiceArgs, ServiceResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly services: ServiceCollection
	) {}

	public async execute({ service }: MutationUpdateServiceArgs): Promise<ServiceResponse> {
		if (!service.id) {
			return new FailedResponse(this.localization.t('mutation.updateService.serviceIdRequired'))
		}

		if (!service.orgId) {
			return new FailedResponse(this.localization.t('mutation.updateService.orgIdRequired'))
		}

		const result = await this.services.itemById(service.id)
		if (!result.item) {
			return new FailedResponse(this.localization.t('mutation.updateService.serviceNotFound'))
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

		await this.services.updateItem({ id: service.id }, { $set: changedData })

		return new SuccessServiceResponse(
			this.localization.t('mutation.updateService.success'),
			createGQLService(changedData)
		)
	}
}
