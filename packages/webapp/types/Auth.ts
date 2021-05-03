/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type User from '~types/user'

export default interface Auth {
	user?: User
	signedIn: false
	loading: false
}
