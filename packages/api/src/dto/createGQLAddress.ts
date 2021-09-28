/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Address } from '@cbosuite/schema/dist/provider-types'
import type { DbAddress } from '~db'

export function createGQLAddress({ street, zip, unit, city, county, state }: DbAddress): Address {
	return {
		__typename: 'Address',
		street,
		zip,
		unit,
		city,
		county,
		state
	}
}
