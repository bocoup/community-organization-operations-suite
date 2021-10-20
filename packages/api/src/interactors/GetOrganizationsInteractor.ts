/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Organization, OrganizationsInput } from '@cbosuite/schema/dist/provider-types'
import { OrganizationCollection } from '~db'
import { createGQLOrganization } from '~dto'
import { Interactor } from '~types'

export class GetOrganizationsInteractor implements Interactor<OrganizationsInput, Organization[]> {
	public constructor(
		private readonly organizations: OrganizationCollection,
		private readonly defaultPageOffset: number,
		private readonly defaultPageLimit: number
	) {}

	public async execute({ offset, limit }: OrganizationsInput): Promise<Organization[]> {
		offset = offset ?? this.defaultPageOffset
		limit = limit ?? this.defaultPageLimit
		const result = await this.organizations.items({ offset, limit })
		return result.items.map(createGQLOrganization)
	}
}
