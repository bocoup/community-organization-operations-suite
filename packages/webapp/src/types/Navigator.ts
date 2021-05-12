/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export default interface Navigator {
	firstName: string
	lastName: string
	fullName: string
	status: string
	requests: {
		assigned: number
		open: number
	}
	id: number
}
