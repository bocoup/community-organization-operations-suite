/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import config, { IConfig } from 'config'

export class Configuration {
	public constructor(private c: IConfig = config) {}

	public get graphiql(): boolean | string {
		return this.c.get<boolean | string>('server.graphiql')
	}
}
