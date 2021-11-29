/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export function noop(...props: any[]): void
// eslint-disable-next-line no-redeclare
export function noop(): void {
	// noop
}

export function nullFn() {
	return null
}

export const empty = Object.freeze([]) as any as any[]
export const emptyObj = Object.freeze({}) as any
export const emptyStr = ''
