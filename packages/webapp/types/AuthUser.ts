/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export default interface AuthUser {
	credential?: {
		accessToken: string
	}
	data?: {
		firstName: string
		lastName: string
	}
}
