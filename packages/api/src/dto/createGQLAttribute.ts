/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Attribute } from '@cbosuite/schema/lib/provider-types'

export function createGQLAttribute({ id, label, description }: Attribute): Attribute {
	return {
		__typename: 'Attribute',
		id,
		label,
		description
	}
}
