/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export function moveUp<T>(index: number, items: T[]): T[] {
	if (index > 0 && index <= items.length - 1) {
		const result = [...items]
		const item = items[index]
		result[index] = items[index - 1]
		result[index - 1] = item
		return result
	} else {
		return items
	}
}

export function moveDown<T>(index: number, items: T[]): T[] {
	if (index >= 0 && index < items.length - 1) {
		const result = [...items]
		const item = items[index]
		result[index] = items[index + 1]
		result[index + 1] = item
		return result
	} else {
		return items
	}
}
