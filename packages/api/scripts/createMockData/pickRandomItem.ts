/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function pickRandomItem<T>(collection: T[]): T {
	return collection[Math.floor(Math.random() * collection.length)]
}
