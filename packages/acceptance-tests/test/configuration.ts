/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IConfig } from 'config'
import config from 'config'

class Configuration {
	public constructor(private _c: IConfig = config) {}

	public get username(): string {
		return this._c.get('user.login')
	}

	public get password(): string {
		return this._c.get('user.password')
	}

	public get url() {
		return this._c.get('url')
	}
}

export const configuration = new Configuration()
