/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContactInfo from '~types/ContactInfo'
import Tag from '~types/Tag'

export default interface Client {
	firstName: string
	lastName: string
	dateOfBirth: Date // (date )
	id: number
	contact?: ContactInfo
	identifiers?: Tag[]
}
