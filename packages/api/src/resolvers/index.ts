/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Resolvers } from '@greenlight/schema/lib/provider-types'
import { IResolvers, MercuriusContext } from 'mercurius'
import { Long } from './Long'

export const resolvers: Resolvers<MercuriusContext> &
	IResolvers<any, MercuriusContext> = {
	Long,
	Query: {
		organizations: async () => [],
	},
}
