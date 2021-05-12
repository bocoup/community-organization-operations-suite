/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IResolvers, MercuriusContext } from 'mercurius'
import { Long } from './Long'
import { Resolvers } from '@greenlight/schema/lib/provider-types'

export const resolvers: Resolvers<MercuriusContext> &
	IResolvers<any, MercuriusContext> = {
	Long,
	Query: {
		cbos: async () => [],
	},
}
