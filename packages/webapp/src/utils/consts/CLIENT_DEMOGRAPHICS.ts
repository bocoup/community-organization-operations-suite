/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const CLIENT_DEMOGRAPHICS = {
	gender: {},
	ethnicity: {
		options: [
			{
				key: 'male',
				text: 'Male'
			},
			{
				key: 'female',
				text: 'Female'
			},
			{
				key: 'other',
				text: 'Other'
			}
		]
	},
	race: {
		options: [
			{
				key: 'american-indian-alaska-native',
				text: 'American Indian / Alaska Native'
			},
			{
				key: 'asian',
				text: 'Asian'
			},
			{
				key: 'black-aa',
				text: 'Black / AA'
			},
			{
				key: 'native-hawaiian-pacific-islander',
				text: 'Native Hawaiian / Pacific Islander'
			},
			{
				key: 'white',
				text: 'white'
			},
			{
				key: 'Other',
				text: 'other'
			}
		]
	},
	preferredContactMethod: {
		options: [
			{
				key: 'phone',
				text: 'Phone'
			},
			{
				key: 'email',
				text: 'Email'
			},
			{
				key: 'at-home-visit',
				text: 'At Home Visit'
			},
			{
				key: 'mail',
				text: 'Mail'
			}
		]
	},
	preferredLanguage: {
		options: [
			{
				key: 'english',
				text: 'English'
			},
			{
				key: 'spanish',
				text: 'Spanish'
			},
			{
				key: 'other',
				text: 'Other'
			}
		]
	},
	preferredContactLanguage: {
		options: [
			{
				key: 'morning',
				text: 'Morning'
			},
			{
				key: 'day',
				text: 'Day'
			},
			{
				key: 'evening',
				text: 'Evening'
			}
		]
	}
}

export default CLIENT_DEMOGRAPHICS
