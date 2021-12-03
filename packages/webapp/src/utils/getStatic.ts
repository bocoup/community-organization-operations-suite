/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function getStatic(path: string) {
	return new URL(path, import.meta.url).pathname
}
