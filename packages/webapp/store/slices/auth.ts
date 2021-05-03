import { createSlice } from '@reduxjs/toolkit'
import type { AppDispatch, RootState } from '~store'
import type Auth from '~types/Auth'

// TODO: add real authentication
const fakeUser = {
	credential: {
		accessToken: 'This is a test'
	},
	data: {
		firstName: 'First',
		lastName: 'Last'
	}
}

export const slice = createSlice({
	name: 'auth',
	initialState: {
		user: undefined,
		signedIn: false,
		loading: false
	},
	reducers: {
		signInUser: (state, action) => {
			state.user = action.payload
			state.signedIn = true
		},
		logoutUser: state => {
			state.signedIn = false
			state.user = undefined
		},
		isLoading: (state, action) => {
			state.loading = !!action.payload
		}
	}
})

export const { logoutUser } = slice.actions
const { isLoading, signInUser } = slice.actions

/**
 * Dispatches actions to login the current user
 */
export const loginUser = () => (dispatch: AppDispatch): void => {
	dispatch(isLoading(true))
	setTimeout(() => {
		dispatch(signInUser(fakeUser))
		dispatch(isLoading(false))
	}, 1000)
}

/**
 * @returns user auth object
 */
export const getAuthUser = (state: RootState): Auth => state.auth as Auth

export default slice.reducer
