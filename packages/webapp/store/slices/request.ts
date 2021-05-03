/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createSlice } from '@reduxjs/toolkit'
// TODO: implement intercepters and error handlers https://github.com/axios/axios#interceptors
import axios, { AxiosResponse } from 'axios'
import { AppDispatch, RootState } from '~store'
import type RequestType from '~types/Request'

export const slice = createSlice({
	name: 'request',
	initialState: {
		isLoading: false,
		data: {}
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
export const loadRequest = (rid: string | string[]) => async (
	dispatch: AppDispatch
): Promise<void> => {
	dispatch(setLoading(true))
	console.log('rid', rid)

	try {
		const requestResponse: AxiosResponse = await axios.get(`/api/v1/requests/${rid}`)

		dispatch(set(requestResponse.data as RequestType))
		debugger
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
// TODO: Add type for request getter
export const getRequest = (state: RootState): RequestType | Record<string, any> =>
	state.request.data

// Export reducer
export default slice.reducer
