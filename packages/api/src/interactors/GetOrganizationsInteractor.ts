/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Organization, QueryOrganizationsArgs } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { OrganizationCollection } from '~db'
import { createGQLOrganization } from '~dto'
import { Interactor } from '~types'

@singleton()
export class GetOrganizationsInteractor
	implements Interactor<QueryOrganizationsArgs, Organization[]>
{
	public constructor(
		private readonly organizations: OrganizationCollection,
		private readonly defaultPageOffset: number,
		private readonly defaultPageLimit: number
	) {}

	public async execute({ offset, limit }: QueryOrganizationsArgs): Promise<Organization[]> {
		offset = offset ?? this.defaultPageOffset
		limit = limit ?? this.defaultPageLimit
		const result = await this.organizations.items({ offset, limit })
		return result.items.map(createGQLOrganization)
	}
}
