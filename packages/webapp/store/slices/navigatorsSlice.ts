/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createSlice } from '@reduxjs/toolkit'
// import axios, { AxiosResponse } from 'axios'
import { AppDispatch, RootState } from '~store'
import Specialist, { SpecialistStatus } from '~types/Specialist'

export const fakeSpecialists: Specialist[] = [
	{
		status: SpecialistStatus.Open,
		firstName: 'Nina',
		lastName: 'Coleman',
		userName: 'Nina',
		fullName: 'Nina T. Coleman',
		requests: {
			assigned: 1,
			open: 3
		},
		age: 45,
		contact: {
			email: 'nina.Coleman@email.com',
			phone: 2065555555
		},
		id: 1
	},
	{
		status: SpecialistStatus.Open,
		firstName: 'Ashok',
		lastName: 'Kumar',
		userName: 'Ashok',
		fullName: 'Ashok Kumar',
		requests: {
			assigned: 1,
			open: 3
		},
		age: 26,
		contact: {
			email: 'ashok.kumar@email.com',
			phone: 2065555555
		},
		id: 2
	},
	{
		status: SpecialistStatus.Busy,
		firstName: 'Dianne',
		lastName: 'Hopper',
		userName: 'Dianne',
		fullName: 'Dianne Hopper',
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
		status: SpecialistStatus.Busy,
		firstName: 'Alex',
		lastName: 'Hopper',
		userName: 'Dianne',
		fullName: 'Dianne Hopper',
		requests: {
			assigned: 1,
			open: 3
		},
		age: 31,
		contact: {
			email: 'dianne.hopper@email.com',
			phone: 2065555555
		},
		id: 4
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
		// const navigatorsResponse: AxiosResponse = await axios.get('/api/v1/navigators')
		// dispatch(setSpecialists(navigatorsResponse.data as Specialist[]))
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
