/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createSlice } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '~store'
import Specialist, { SpecialistStatus } from '~types/Specialist'

export let fakeSpecialists: Specialist[] = []

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
export const loadSpecialists = (orgData?: any) => async (dispatch: AppDispatch): Promise<void> => {
	if (orgData) {
		fakeSpecialists = orgData.users
	}

	// dispatch(setLoading(true))
	// try {
	// 	// TODO: replace with server call
	// 	dispatch(setSpecialists(fakeSpecialists))
	// } catch (error) {
	// 	// TODO: handle errors here
	// 	console.log('error', error)
	// } finally {
	// 	dispatch(setLoading(false))
	// }
}

/**
 * Add getters here
 */
export const getSpecialists = (state: RootState): Specialist[] =>
	state.navigators.data as Specialist[]

// Export reducer
export default slice.reducer
