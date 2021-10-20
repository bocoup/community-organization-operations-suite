/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { OrganizationIdInput, Service } from '@cbosuite/schema/dist/provider-types'
import { ServiceCollection } from '~db'
import { createGQLService } from '~dto'
import { Interactor, RequestContext } from '~types'
import { empty } from '~utils/noop'

export class GetServicesInteractor implements Interactor<OrganizationIdInput, Service[]> {
	public constructor(private readonly services: ServiceCollection) {}

	public async execute({ orgId }: OrganizationIdInput, ctx: RequestContext): Promise<Service[]> {
		// out-of-org users should not see org services
		if (orgId !== ctx.orgId) {
			return empty
		}
		const result = await this.services.items({}, { org_id: orgId })
		return result.items.map(createGQLService)
	}
}
