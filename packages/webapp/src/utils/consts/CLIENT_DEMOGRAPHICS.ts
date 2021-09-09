/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const CLIENT_DEMOGRAPHICS = {
	gender: {
		label: 'gender',
		options: [
			{
				key: 'male'
			},
			{
				key: 'female'
			},
			{
				key: 'other'
			}
		]
	},
	ethnicity: {
		label: 'ethnicity',
		options: [
			{
				key: 'hispanic'
			},
			{
				key: 'not-hispanic-or-latino'
			},
			{
				key: 'unknown'
			}
		]
	},
	race: {
		label: 'race',
		options: [
			{
				key: 'american-indian-alaska-native'
			},
			{
				key: 'asian'
			},
			{
				key: 'black-aa'
			},
			{
				key: 'native-hawaiian-pacific-islander'
			},
			{
				key: 'white'
			},
			{
				key: 'other'
			}
		]
	},
	preferredContactMethod: {
		label: 'preferredContactMethod',
		options: [
			{
				key: 'phone'
			},
			{
				key: 'email'
			},
			{
				key: 'at-home-visit'
			},
			{
				key: 'mail'
			}
		]
	},
	preferredLanguage: {
		label: 'preferredLanguage',
		options: [
			{
				key: 'english'
			},
			{
				key: 'spanish'
			},
			{
				key: 'other'
			}
		]
	},
	preferredContactTime: {
		label: 'preferredContactTime',
		options: [
			{
				key: 'morning'
			},
			{
				key: 'day'
			},
			{
				key: 'evening'
			}
		]
	}
}

export default CLIENT_DEMOGRAPHICS
