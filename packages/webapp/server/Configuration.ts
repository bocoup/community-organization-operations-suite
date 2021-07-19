/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IConfig } from 'config'

/**
 * Webapp Configuration
 */
export class Configuration {
	public constructor(private config: IConfig) {}

	public get isDevMode(): boolean {
		return this.config.get<boolean>('server.devMode')
	}

	public get port(): number {
		return this.config.get<number>('server.port')
	}

	public get sslToken(): string {
		return this.config.get<string>('server.sslToken')
	}

	public get apiUrl(): string {
		return this.config.get<string>('api.url')
	}
}
