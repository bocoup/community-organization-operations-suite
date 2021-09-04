/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IResolvers } from '@graphql-tools/utils'
import { AppContext } from '~types'
import { Resolvers } from '@cbosuite/schema/dist/provider-types'
import { Query } from './Query'
import { Subscription } from './Subscription'
import { Mutation } from './Mutation'
import { primitives } from './primitives'
import { types } from './types'

export const resolvers: Resolvers<AppContext> & IResolvers<any, AppContext> = {
	Query,
	Mutation,
	Subscription,
	...primitives,
	...types
}
