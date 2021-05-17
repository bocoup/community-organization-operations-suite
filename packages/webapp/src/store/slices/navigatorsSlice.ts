/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createSlice } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '~store'
import Specialist, { SpecialistStatus } from '~types/Specialist'

export const fakeSpecialists: Specialist[] = [
	{
		avatar: 'https://i.pravatar.cc/300?u=Nina',
		status: SpecialistStatus.Closed,
		firstName: 'Nina',
		lastName: 'Coleman',
		userName: 'Nina',
		fullName: 'Nina T. Coleman',
		bio: 'Nina is an intern at CBO Name Here',
		trainingAndAchievements:
			'Undergraduate degree in Sociology. Studying to get her MSW from the University of Washington.',
		tags: [
			{
				id: 1,
				label: 'In Training'
			}
		],
		requests: {
			assigned: 1,
			open: 3
		},
		age: 26,
		contact: {
			email: 'nina.Coleman@email.com',
			phone: 2065555555
		},
		id: 1
	},
	{
		avatar: 'https://i.pravatar.cc/300?u=Ashok',
		status: SpecialistStatus.Open,
		firstName: 'Ashok',
		lastName: 'Kumar',
		userName: 'Ashok',
		fullName: 'Ashok Kumar',
		bio:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nunc a semper rutrum, sem elit rhoncus velit, id malesuada lorem felis at risus. Aenean porta maximus condimentum. Nulla dictum ligula eget risus finibus finibus. Nam malesuada a enim non ornare. Etiam mattis, nulla porta vulputate fringilla, arcu nibh rhoncus libero, sollicitudin semper arcu felis tempus sapien. Nulla porttitor tempor metus mollis ornare. ',
		trainingAndAchievements:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nunc a semper rutrum, sem elit rhoncus velit, id malesuada lorem felis at risus. Aenean porta maximus condimentum. Nulla dictum ligula eget risus finibus finibus. Nam malesuada a enim non ornare. Etiam mattis, nulla porta vulputate fringilla, arcu nibh rhoncus libero, sollicitudin semper arcu felis tempus sapien. Nulla porttitor tempor metus mollis ornare. ',
		tags: [
			{
				id: 3,
				label: 'Hindi'
			}
		],
		requests: {
			assigned: 1,
			open: 3
		},
		age: 42,
		contact: {
			email: 'ashok.kumar@email.com',
			phone: 2065555555
		},
		id: 2
	},
	{
		avatar: 'https://i.pravatar.cc/300?u=Dianne',
		status: SpecialistStatus.Busy,
		firstName: 'Dianne',
		lastName: 'Hopper',
		userName: 'Dianne',
		fullName: 'Dianne Hopper',
		bio:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nunc a semper rutrum, sem elit rhoncus velit, id malesuada lorem felis at risus. Aenean porta maximus condimentum. Nulla dictum ligula eget risus finibus finibus. Nam malesuada a enim non ornare. Etiam mattis, nulla porta vulputate fringilla, arcu nibh rhoncus libero, sollicitudin semper arcu felis tempus sapien. Nulla porttitor tempor metus mollis ornare. ',
		trainingAndAchievements:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nunc a semper rutrum, sem elit rhoncus velit, id malesuada lorem felis at risus. Aenean porta maximus condimentum. Nulla dictum ligula eget risus finibus finibus. Nam malesuada a enim non ornare. Etiam mattis, nulla porta vulputate fringilla, arcu nibh rhoncus libero, sollicitudin semper arcu felis tempus sapien. Nulla porttitor tempor metus mollis ornare. ',
		tags: [
			{
				id: 2,
				label: 'Hispanic'
			}
		],
		requests: {
			assigned: 1,
			open: 3
		},
		age: 31,
		contact: {
			email: 'dianne.hopper@email.com',
			phone: 2065555555
		},
		id: 3
	},
	{
		avatar: 'https://i.pravatar.cc/300?u=62',
		status: SpecialistStatus.Open,
		firstName: 'Phoebe',
		lastName: 'Anderson',
		userName: 'Phoebe',
		fullName: 'Phoebe Anderson',
		bio:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nunc a semper rutrum, sem elit rhoncus velit, id malesuada lorem felis at risus. Aenean porta maximus condimentum. Nulla dictum ligula eget risus finibus finibus. Nam malesuada a enim non ornare. Etiam mattis, nulla porta vulputate fringilla, arcu nibh rhoncus libero, sollicitudin semper arcu felis tempus sapien. Nulla porttitor tempor metus mollis ornare. ',
		trainingAndAchievements:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nunc a semper rutrum, sem elit rhoncus velit, id malesuada lorem felis at risus. Aenean porta maximus condimentum. Nulla dictum ligula eget risus finibus finibus. Nam malesuada a enim non ornare. Etiam mattis, nulla porta vulputate fringilla, arcu nibh rhoncus libero, sollicitudin semper arcu felis tempus sapien. Nulla porttitor tempor metus mollis ornare. ',
		tags: [
			{
				id: 6,
				label: 'MSW'
			},
			{
				id: 6,
				label: 'Conflict Management'
			}
		],
		requests: {
			assigned: 1,
			open: 3
		},
		age: 29,
		contact: {
			email: 'phoebe.anderson@email.com',
			phone: 2065555555
		},
		id: 4
	},
	{
		avatar: 'https://i.pravatar.cc/300?img=62',
		status: SpecialistStatus.Open,
		firstName: 'Chrisanty',
		lastName: 'Mosqueda',
		userName: 'Batch',
		fullName: 'Chrisanty Mosqueda',
		bio: 'Batch is a very smart and talented developer who is really good at coding.',
		tags: [
			{
				id: 7,
				label: 'Developer'
			}
		],
		requests: {
			assigned: 1,
			open: 3
		},
		age: 29,
		contact: {
			email: 'batch.mosqueda@email.com',
			phone: 2065555555
		},
		id: 5
	}
]

export interface SpecialistsType {
	isLoading: boolean
	data: Specialist[]
}

export const slice = createSlice({
	name: 'navigators',
	initialState: {
		isLoading: false,
		data: []
	},
	reducers: {
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
		setSpecialists: (state, action) => {
			state.data = action.payload
		}
	}
})

// Export actions
export const { setSpecialists } = slice.actions

// Private actions
const { setLoading } = slice.actions

/**
 * Add async and dynamic actions here
 */
// export const loadSpecialists = (dispatch: AppDispatch): void => {
// 	setTimeout(() => {
// 		dispatch(setLoading(true))
// 		try {
// 			// TODO: load content here
// 			dispatch(setSpecialists(fakeSpecialists))
// 		} catch (error) {
// 			// TODO: handle errors here
// 			console.log('error', error)
// 		} finally {
// 			dispatch(setLoading(false))
// 		}
// 	}, 1000)
// }

/**
 * Add async and dynamic actions here
 */
export const loadSpecialists = () => async (dispatch: AppDispatch): Promise<void> => {
	dispatch(setLoading(true))
	try {
		// TODO: replace with server call
		dispatch(setSpecialists(fakeSpecialists))
	} catch (error) {
		// TODO: handle errors here
		console.log('error', error)
	} finally {
		dispatch(setLoading(false))
	}
}

/**
 * Add getters here
 */
export const getSpecialists = (state: RootState): Specialist[] =>
	state.navigators.data as Specialist[]

// Export reducer
export default slice.reducer
