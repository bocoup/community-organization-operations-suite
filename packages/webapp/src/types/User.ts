/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import ContactInfo from '~types/ContactInfo'

export default interface User {
	name: {
		first: string
		middle?: string
		last: string
	}
	fullName?: string
	status?: string
	id: string
	age?: number
	contact?: ContactInfo
}
