/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { History } from 'history'
import { ApplicationRoute } from '~types/ApplicationRoute'
import { getLocationQuery } from './getLocationQuery'

/**
 *
 * @param history The history object to use
 * @param path The path to navigate to, relative to site root. null = current path
 * @param searchArgs The search arguments to add or change.
 */
export function navigate(
	history: History<unknown>,
	path: ApplicationRoute | null,
	searchArgs: Record<string, any> = {}
): void {
	const newPath = path == null ? history.location.path || '' : path
	const search = buildSearchString(history, searchArgs)
	history.push(`${newPath}${search}`)
}

function buildSearchString(history: History<unknown>, searchArgs: Record<string, any>): string {
	const existingQueryArgs = getLocationQuery(history.location.search)
	const newSearchArgs = { locale: existingQueryArgs.locale, ...searchArgs }
	const searchClauses = Object.keys(newSearchArgs)
		.filter((key) => newSearchArgs[key] != null)
		.map((key) => `${key}=${newSearchArgs[key]}`)
		.join('&')
	return searchClauses.length > 0 ? `?${searchClauses}` : ''
}
