/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import ContactInfo from '~types/ContactInfo'

export default interface Requester {
	firstName: string
	lastName: string
	fullName?: string
	request: string
	timeRemaining: string
	status: string
	id: number
	age: number
	contact?: ContactInfo
}
