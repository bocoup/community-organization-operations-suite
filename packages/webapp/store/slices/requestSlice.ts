/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createSlice } from '@reduxjs/toolkit'
// TODO: implement intercepters and error handlers https://github.com/axios/axios#interceptors
// import axios, { AxiosResponse } from 'axios'
import { AppDispatch, RootState } from '~store'
import IRequest, { RequestStatus } from '~types/Request'
import { SpecialistStatus } from '~types/Specialist'

export const FAKE_REQUEST: IRequest = {
	request:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	requester: {
		firstName: 'Jen',
		lastName: 'Janson',
		fullName: 'Jen Janson',
		age: 62,
		contact: {
			email: 'jennifer.janson@email.com',
			phone: 2065555555,
			street: '1134 NE 11th St.',
			city: 'Seattle',
			state: 'WA',
			zip: '98100'
		},
		id: 1
	},
	tags: [
		{
			id: 'in-need',
			label: 'In Need'
		},
		{
			id: 'spanish',
			label: 'Spanish'
		}
	],
	timeRemaining: '23',
	status: RequestStatus.Open,
	id: 1,
	specialist: {
		status: SpecialistStatus.Open,
		firstName: 'Miguel',
		lastName: 'Specialist',
		fullName: 'Miguel T. Specialist',
		age: 62,
		contact: {
			email: 'miguel.specialist@email.com',
			phone: 2065555555
		},
		id: 1
	}
}

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
		// TODO: pull data from server
		// const requestResponse: AxiosResponse = await axios.get(`/api/v1/requests/${rid}`)

		dispatch(set(FAKE_REQUEST))
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
