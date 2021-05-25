/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export interface ApiResponse<T> {
	loading: boolean
	data: T | null
	error: Error
	refetch: (variables: Record<string, any>) => void
}
