/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { History } from 'history'
import { getLocationQuery } from './getLocationQuery'

export function navigate(
	history: History<unknown>,
	path: string,
	searchArgs: Record<string, any> = {}
): void {
	const existingQueryArgs = getLocationQuery(history.location.search)
	const newSearchArgs = { locale: existingQueryArgs.locale, ...searchArgs }
	const searchClauses = Object.keys(newSearchArgs)
		.filter((key) => newSearchArgs[key] != null)
		.map((key) => `${key}=${newSearchArgs[key]}`)
		.join('&')
	const search = searchClauses.length > 0 ? `?${searchClauses}` : ''
	history.push(`${path}${search}`)
}
