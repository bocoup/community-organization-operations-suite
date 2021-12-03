/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import faker from 'faker'

export function createFakeAddress() {
	return {
		street: faker.address.streetAddress(),
		city: faker.address.city(),
		state: faker.address.stateAbbr(),
		zip: faker.address.zipCode()
	}
}

export function createFakeName() {
	return {
		first: faker.name.firstName(),
		middle: faker.name.middleName(),
		last: faker.name.lastName()
	}
}
