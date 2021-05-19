/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createSlice } from '@reduxjs/toolkit'
import { get } from 'lodash'
import { fakeSpecialists } from './navigatorsSlice'
import { AppDispatch, RootState } from '~store'
import IRequest, { RequestStatus } from '~types/Request'

export const fakeRequests: IRequest[] = [
	{
		request: 'Needs help getting vaccinated.',
		requester: {
			firstName: 'Melissa',
			lastName: 'Saunders',
			fullName: 'Melissa Saunders',
			age: 37,
			contact: {
				email: 'melissa.saunders@email.com',
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
		timeRemaining: '23 hours',
		status: RequestStatus.Open,
		id: 1,
		specialist: get(fakeSpecialists, 0)
	},
	{
		request:
			'Is trying to get in contact with an organization that can help him manage his mental and physical health needs as well as vaccination.',
		requester: {
			firstName: 'Jorge',
			lastName: 'Guajardo',
			fullName: 'Jorge Guajardo',
			age: 62,
			contact: {
				email: 'Jorge.Guajardo@email.com',
				phone: 2065555555,
				street: '1134 NE 11th St.',
				city: 'Seattle',
				state: 'WA',
				zip: '98107'
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
		timeRemaining: '16 hours',
		status: RequestStatus.Open,
		id: 2,
		specialist: get(fakeSpecialists, 1)
	},
	{
		request: 'Needs help getting vaccinated.',
		requester: {
			firstName: 'Rafael',
			lastName: 'Martinez',
			fullName: 'Rafael Martinez',
			age: 62,
			contact: {
				email: 'rafael.martinez@email.com',
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
		timeRemaining: '2 hours',
		status: RequestStatus.Open,
		id: 3,
		specialist: get(fakeSpecialists, 2)
	},
	{
		request: 'Needs help getting dependants vaccinated.',
		requester: {
			firstName: 'Angel',
			lastName: 'Muro',
			fullName: 'Angel Muro',
			age: 62,
			contact: {
				email: 'angel.muro@email.com',
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
		timeRemaining: '1 day',
		status: RequestStatus.Open,
		id: 4,
		specialist: get(fakeSpecialists, 2)
	}
]

export const slice = createSlice({
	name: 'requests',
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
export const loadRequests = () => async (dispatch: AppDispatch): Promise<void> => {
	dispatch(setLoading(true))
	try {
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
// TODO: Add type for requests getter
export const getRequests = (state: RootState): IRequest[] => state.requests.data

// Export reducer
export default slice.reducer
