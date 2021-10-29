/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Organization, QueryOrganizationArgs } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { OrganizationCollection } from '~db'
import { createGQLOrganization } from '~dto'
import { Interactor } from '~types'

@singleton()
export class GetOrganizationInteractor
	implements Interactor<QueryOrganizationArgs, Organization | null>
{
	public constructor(private readonly organizations: OrganizationCollection) {}

	public async execute({ orgId }: QueryOrganizationArgs): Promise<Organization | null> {
		const result = await this.organizations.itemById(orgId)
		return result.item ? createGQLOrganization(result.item) : null
	}
}
