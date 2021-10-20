/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Organization, OrganizationIdInput } from '@cbosuite/schema/dist/provider-types'
import { OrganizationCollection } from '~db'
import { createGQLOrganization } from '~dto'
import { Interactor } from '~types'

export class GetOrganizationInteractor
	implements Interactor<OrganizationIdInput, Organization | null>
{
	public constructor(private readonly organizations: OrganizationCollection) {}

	public async execute({ orgId }: OrganizationIdInput): Promise<Organization | null> {
		const result = await this.organizations.itemById(orgId)
		return result.item ? createGQLOrganization(result.item) : null
	}
}
