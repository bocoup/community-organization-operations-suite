/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createSlice } from '@reduxjs/toolkit'
// TODO: implement intercepters and error handlers https://github.com/axios/axios#interceptors
// import axios, { AxiosResponse } from 'axios'
import { FAKE_REQUEST } from '~slices/requestSlice'
import { AppDispatch, RootState } from '~store'
import type IRequest from '~types/Request'

const fakeRequests: IRequest[] = []

for (let i = 1; i <= 3; i++) {
	fakeRequests.push({ ...FAKE_REQUEST, id: i })
}

export const slice = createSlice({
	name: 'myRequests',
	initialState: {
		isLoading: false,
		data: []
	},
	reducers: {
		set: (state, action) => {
			state.data = action.payload
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload
		}
	}
})

// Export actions
export const { set } = slice.actions

// Private actions
const { setLoading } = slice.actions

/**
 * Add async and dynamic actions here
 */
export const loadMyRequests = () => async (dispatch: AppDispatch): Promise<void> => {
	dispatch(setLoading(true))
	try {
		// const myRequestsResponse: AxiosResponse = await axios.get('/api/v1/currentuser/requests')

		dispatch(set(fakeRequests))
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
// TODO: Add type for myRequests getter
export const getMyRequests = (state: RootState): IRequest[] => state.myRequests.data

// Export reducer
export default slice.reducer
