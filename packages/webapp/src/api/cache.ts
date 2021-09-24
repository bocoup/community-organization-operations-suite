/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { InMemoryCache, ReactiveVar, makeVar } from '@apollo/client'
import type { Engagement } from '@cbosuite/schema/dist/client-types'
import localForage from 'localforage'
import { persistCache, LocalForageWrapper } from 'apollo3-cache-persist'

// import { VisibilityFilter, VisibilityFilters } from './models/VisibilityFilter'

export const cache: InMemoryCache = new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				engagements: {
					read() {
						return engagementListVar()
					}
				}
				// visibilityFilter: {
				// 	read() {
				// 		return visibilityFilterVar()
				// 	}
				// }
			}
		}
	}
})

/**
 * Set initial values when we create cache variables.
 */

const engagementListInitialValue: Engagement[] = []

export const engagementListVar: ReactiveVar<Engagement[]> = makeVar<Engagement[]>(
	engagementListInitialValue
)

// export const visibilityFilterVar = makeVar<VisibilityFilter>(VisibilityFilters.SHOW_ALL)

let isDurableCacheInitialized = false

/**
 * Enable Cache persistence for offline mode
 */
async function initializeCache() {
	const result = await persistCache({ cache, storage: new LocalForageWrapper(localForage) })
	isDurableCacheInitialized = true
	return result
}

export async function getCache() {
	if (!isDurableCacheInitialized) {
		await initializeCache()
	}
	return cache
}
