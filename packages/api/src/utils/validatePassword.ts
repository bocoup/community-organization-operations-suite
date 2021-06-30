/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import bcrypt from 'bcrypt'

export function validatePassword(password1: string, password2: string): boolean {
	return bcrypt.compareSync(password1, password2)
}
