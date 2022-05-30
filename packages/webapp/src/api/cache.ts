/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { config } from '~utils/config'
import { InMemoryCache } from '@apollo/client/core'
import localForage from 'localforage'
import { persistCache, LocalForageWrapper } from 'apollo3-cache-persist'
import { createLogger } from '~utils/createLogger'
import { cacheMerge, cacheRead } from '~utils/engagements'

/**
 * Setup the "InMemoryCache" for Apollo.
 *
 * If the `durableCache` feature has been enabled in the config:
 *  	1. We setup `apollo3-cache-persist` to handle cache persistence.
 *		2. `localforage` is used to handle Browser native storages APIs.
 * 		3. Everything is logged.
 */

let isDurableCacheInitialized = false
const isDurableCacheEnabled = Boolean(config.features.durableCache.enabled)
const logger = createLogger('cache')

const cache: InMemoryCache = new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				activeEngagements: {
					merge: cacheMerge
					// Cache Redirects
					// https://www.apollographql.com/docs/react/caching/advanced-topics#cache-redirects
				},
				inactiveEngagements: {
					merge: cacheMerge
				},
				userActiveEngagements: {
					merge: cacheMerge
				}
			}
		}
	}
})

export function getCache() {
	if (isDurableCacheInitialized) {
		logger('durable cache is enabled')
	} else if (!isDurableCacheInitialized && isDurableCacheEnabled) {
		persistCache({ cache, storage: new LocalForageWrapper(localForage) })
			.then(() => {
				isDurableCacheInitialized = true
				logger('durable cache is setup and enabled')
			})
			.catch((err) => logger('error setting up durable cache', err))
	} else {
		logger('no durable cache setup')
	}
	return cache
}
