/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationUpdateServiceArgs, ServiceResponse } from '@cbosuite/schema/dist/provider-types'
import { UserInputError } from 'apollo-server-errors'
import { Localization } from '~components'
import { ServiceCollection } from '~db'
import { createDBServiceFields, createGQLService } from '~dto'
import { Interactor, RequestContext } from '~types'
import { SuccessServiceResponse } from '~utils/response'
import { Telemetry } from '~components/Telemetry'

export class UpdateServiceInteractor
	implements Interactor<MutationUpdateServiceArgs, ServiceResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly services: ServiceCollection,
		private readonly telemetry: Telemetry
	) {}

	public async execute(
		{ service }: MutationUpdateServiceArgs,
		{ locale }: RequestContext
	): Promise<ServiceResponse> {
		if (!service.id) {
			throw new UserInputError(
				this.localization.t('mutation.updateService.serviceIdRequired', locale)
			)
		}

		if (!service.orgId) {
			throw new UserInputError(this.localization.t('mutation.updateService.orgIdRequired', locale))
		}

		const result = await this.services.itemById(service.id)
		if (!result.item) {
			throw new UserInputError(
				this.localization.t('mutation.updateService.serviceNotFound', locale)
			)
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

		this.telemetry.trackEvent('UpdateService')
		return new SuccessServiceResponse(
			this.localization.t('mutation.updateService.success', locale),
			createGQLService(changedData)
		)
	}
}
