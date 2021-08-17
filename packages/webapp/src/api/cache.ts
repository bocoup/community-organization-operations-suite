/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { InMemoryCache, ReactiveVar, makeVar } from '@apollo/client'
import type { Engagement } from '@cbosuite/schema/lib/client-types'

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
