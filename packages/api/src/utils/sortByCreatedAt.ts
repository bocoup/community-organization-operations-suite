/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { sortByDate } from './sortByDate'

export type HasCreatedAt = {
	createdAt: string
}

export function sortByCreatedAt(a: HasCreatedAt, b: HasCreatedAt): number {
	return sortByDate({ date: a.createdAt }, { date: b.createdAt })
}
