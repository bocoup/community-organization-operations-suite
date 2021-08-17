/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ApolloQueryResult } from '@apollo/client/core/types'
import { StatusType } from '@cbosuite/schema/lib/client-types'

export interface ApiResponse<T> {
	loading: boolean
	data?: T | null
	error: Error
	refetch?: (variables: Record<string, any>) => Promise<ApolloQueryResult<any>>
	fetchMore?: (variables: Record<string, any>) => Promise<ApolloQueryResult<any>>
}

export interface AuthResponse {
	accessToken?: string
	message?: string
	status: StatusType
}
