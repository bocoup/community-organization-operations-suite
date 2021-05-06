/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type AuthUser from '~types/AuthUser'

export default interface Auth {
	user?: AuthUser
	signedIn: boolean
	loading: boolean
}
