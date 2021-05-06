/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createSlice } from '@reduxjs/toolkit'
// import axios, { AxiosResponse } from 'axios'
import { AppDispatch, RootState } from '~store'
import Navigator from '~types/Navigator'

const fakeNavigators: Navigator[] = [
	{
		firstName: 'firstname',
		lastName: 'lastname',
		fullName: 'Firstname Lastname',
		status: 'open',
		requests: {
			assigned: 1,
			open: 3
		},
		id: 1
	},
	{
		firstName: 'firstname2',
		lastName: 'lastname2',
		fullName: 'Firstname Lastname2',
		status: 'busy',
		requests: {
			assigned: 1,
			open: 3
		},
		id: 2
	},
	{
		firstName: 'firstname3',
		lastName: 'lastname3',
		fullName: 'Firstname Lastname3',
		status: 'closed',
		requests: {
			assigned: 1,
			open: 3
		},
		id: 3
	}
]

export interface NavigatorsType {
	isLoading: boolean
	data: Navigator[]
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
		setNavigators: (state, action) => {
			state.data = action.payload
		}
	}
})

// Export actions
export const { setNavigators } = slice.actions

// Private actions
const { setLoading } = slice.actions

/**
 * Add async and dynamic actions here
 */
// export const loadNavigators = (dispatch: AppDispatch): void => {
// 	setTimeout(() => {
// 		dispatch(setLoading(true))
// 		try {
// 			// TODO: load content here
// 			dispatch(setNavigators(fakeNavigators))
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
export const loadNavigators = () => async (dispatch: AppDispatch): Promise<void> => {
	dispatch(setLoading(true))
	try {
		// TODO: replace with server call
		// const navigatorsResponse: AxiosResponse = await axios.get('/api/v1/navigators')
		// dispatch(setNavigators(navigatorsResponse.data as Navigator[]))
		dispatch(setNavigators(fakeNavigators))
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
export const getNavigators = (state: RootState): Navigator[] => state.navigators.data as Navigator[]

// Export reducer
export default slice.reducer
