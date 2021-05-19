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

	public get port(): number {
		return this.c.get<number>('server.port')
	}

	public get host(): string {
		return this.c.get<string>('server.host')
	}

	public get dbConnectionString(): string {
		return this.c.get<string>('db.connectionString')
	}

	public get prettyLogging(): boolean {
		return this.c.get<boolean>('logging.pretty')
	}
}
