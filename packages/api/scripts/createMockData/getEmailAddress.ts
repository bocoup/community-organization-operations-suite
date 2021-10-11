/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function getEmailAddress(index: number, name: string): string {
	if (index === 0) {
		return `admin@${name}.com`.toLowerCase()
	} else {
		return `user_${index}@${name}.com`.toLowerCase()
	}
}
