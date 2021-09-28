/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import config from '~utils/config'
import { InMemoryCache, ReactiveVar, makeVar } from '@apollo/client'
import type { Engagement } from '@cbosuite/schema/dist/client-types'
import localForage from 'localforage'
import { persistCache, LocalForageWrapper } from 'apollo3-cache-persist'
import { createLogger } from '~utils/createLogger'

const logger = createLogger('cache')

// import { VisibilityFilter, VisibilityFilters } from './models/VisibilityFilter'

export const cache: InMemoryCache = new InMemoryCache()

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

export function getCache() {
	if (!isDurableCacheInitialized && isDurableCacheEnabled()) {
		logger('durable cache enabled')
		initializeCache()
			.then(() => logger('cache persisted'))
			.catch((err) => logger('error persisting cache', err))
	} else {
		logger('durable cache disabled')
	}
	return cache
}

function isDurableCacheEnabled() {
	return Boolean(config.features.durableCache.enabled)
}
