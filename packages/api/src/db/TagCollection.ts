/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { CollectionBase } from './CollectionBase'
import type { DbTag } from './types'

export class TagCollection extends CollectionBase<DbTag> {
	public findTagsWithOrganization(orgId: string, offset = 0, limit = 100) {
		return this.items({ offset, limit }, { org_id: orgId })
	}
}
