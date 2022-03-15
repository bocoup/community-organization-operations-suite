/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationUpdateServiceArgs, ServiceResponse } from '@cbosuite/schema/dist/provider-types'
import { UserInputError, ForbiddenError } from 'apollo-server-errors'
import { createDBServiceFields, createGQLService } from '~dto'
import { Interactor, RequestContext } from '~types'
import { SuccessServiceResponse } from '~utils/response'
import { singleton } from 'tsyringe'
import { Localization } from '~components/Localization'
import { ServiceCollection } from '~db/ServiceCollection'
import { Telemetry } from '~components/Telemetry'
import { createAuditLog } from '~utils/audit'

@singleton()
export class UpdateServiceInteractor
	implements Interactor<unknown, MutationUpdateServiceArgs, ServiceResponse>
{
	public constructor(
		private localization: Localization,
		private services: ServiceCollection,
		private telemetry: Telemetry
	) {}

	public async execute(
		_: unknown,
		{ service }: MutationUpdateServiceArgs,
		{ locale, identity }: RequestContext
	): Promise<ServiceResponse> {
		if (!identity?.id) throw new ForbiddenError('not authenticated')
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

		const [audit_log, update_date] = createAuditLog('update service', identity.id)
		const changedData = {
			...dbService,
			name: service.name || dbService.name,
			description: service.description || dbService.description,
			tags: service.tags || dbService.tags,
			fields: service.fields ? createDBServiceFields(service.fields) : dbService.fields,
			contactFormEnabled: service.contactFormEnabled,
			status: service.status || dbService.status,
			update_date
		}

		await this.services.updateItem({ id: service.id }, { $set: changedData, $push: { audit_log } })

		this.telemetry.trackEvent('UpdateService')
		return new SuccessServiceResponse(
			this.localization.t('mutation.updateService.success', locale),
			createGQLService(changedData)
		)
	}
}
