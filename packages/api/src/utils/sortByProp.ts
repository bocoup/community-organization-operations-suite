/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { get } from 'lodash'

export default function sortByProp<T>(source: T[], propToSort: string): T[] {
	const sortedList = Object.values(source).sort((a, b) =>
		get(a, propToSort) > get(b, propToSort) ? 1 : -1
	)

	return sortedList
}
