/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
declare const __CONFIG__: Config

export interface Config {
	url: string
	user: {
		login: string
		password: string
	}
}

export function getConfig(): Config {
	return __CONFIG__
}
