/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import reducers from './slices'
import { atom, selector } from 'recoil'
import type { AuthenticationResponse } from '@greenlight/schema/lib/client-types'

// Combine all reducers
const rootReducer = combineReducers(reducers)

// Persist to local storage config
const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['auth', 'pageReducer'], //Things u want to persist
	blacklist: [] //Things u dont
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

// Export type of the root reducer
export type RootState = ReturnType<typeof persistedReducer>

// Create and export the store
export const store = configureStore({ reducer: persistedReducer })

// Persist store to local storage
export const persistor = persistStore(store)

// Export type of the dispatch function
export type AppDispatch = typeof store.dispatch

// Export a hook that can be reused to resolve types
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>()

// atomic state for user auth
export const userAuthState = atom<AuthenticationResponse>({
	key: 'userAuthState',
	default: null
})

export const getAuthState = selector({
	key: 'GetAuthState',
	get: ({ get }) => get(userAuthState)
})
