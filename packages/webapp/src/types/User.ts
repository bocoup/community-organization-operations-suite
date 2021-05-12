/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import ContactInfo from '~types/ContactInfo'

export default interface User {
	firstName: string
	lastName: string
	fullName?: string
	status?: string
	id: number | string
	age?: number
	contact?: ContactInfo
}
