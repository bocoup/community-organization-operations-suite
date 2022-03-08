/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ApolloQueryResult } from '@apollo/client/core/types'

export enum StatusType {
	Success = 'SUCCESS',
	Failed = 'FAILED'
}
export interface ApiResponse<T> {
	loading: boolean
	data?: T | null
	error: Error
	refetch?: (variables: Record<string, any>) => Promise<ApolloQueryResult<any>>
	fetchMore?: (variables: Record<string, any>) => Promise<ApolloQueryResult<any>>
}

export interface AuthResponse extends MessageResponse {
	accessToken?: string
	message?: string
}

export interface MessageResponse {
	message?: string
	status: StatusType
}
