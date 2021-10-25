/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { QueryServicesArgs, Service } from '@cbosuite/schema/dist/provider-types'
import { ServiceCollection } from '~db'
import { createGQLService } from '~dto'
import { Interactor, RequestContext } from '~types'
import { empty } from '~utils/noop'

export class GetServicesInteractor implements Interactor<QueryServicesArgs, Service[]> {
	public constructor(private readonly services: ServiceCollection) {}

	public async execute({ orgId }: QueryServicesArgs, ctx: RequestContext): Promise<Service[]> {
		// out-of-org users should not see org services
		if (!ctx.identity?.roles.some((r) => r.org_id === orgId)) {
			return empty
		}
		const result = await this.services.items({}, { org_id: orgId })
		return result.items.map(createGQLService)
	}
}
