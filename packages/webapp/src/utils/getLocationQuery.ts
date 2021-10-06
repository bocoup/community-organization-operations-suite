/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function getLocationQuery(searchString: string): Record<string, any> {
	const search = new URLSearchParams(searchString)
	const result: Record<string, any> = {}
	const keys = search.keys()
	let next = keys.next()
	do {
		result[next.value] = search.get(next.value)
		next = keys.next()
	} while (!next.done)
	return result
}
