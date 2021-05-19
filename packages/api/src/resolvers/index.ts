/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IResolvers } from 'mercurius'
import type { AppContext } from '../types'
import { Long } from './Long'
import type { Resolvers } from '@greenlight/schema/lib/provider-types'

export const resolvers: Resolvers<AppContext> & IResolvers<any, AppContext> = {
	Long,
	Query: {
		organizations: async (_, args, context, info) => {
			return []
		},
	},
}
