/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
<<<<<<< HEAD
import type User from '~types/User'
=======
import type AuthUser from '~types/AuthUser'
>>>>>>> 089de5b (Updated webapp)

export default interface Auth {
	user?: AuthUser
	signedIn: boolean
	loading: boolean
}
