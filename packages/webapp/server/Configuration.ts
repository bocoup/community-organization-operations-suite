/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/**
 * Next App Server-Side Code
 */
import { IConfig } from 'config'

export class Configuration {
	public constructor(private config: IConfig) {}

	public get isDevMode(): boolean {
		return this.config.get<boolean>('server.devMode')
	}

	public get port(): number {
		return this.config.get<number>('server.port')
	}

	public get apiUrl(): string {
		return this.config.get<string>('api.url')
	}

	public get graphiql(): boolean | string {
		return this.config.get<string>('api.graphiql')
	}
}
