/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IConfig } from 'config'

/**
 * Service worker Configuration
 */
export class Configuration {
	public constructor(private config: IConfig) {}

	public get apiKey(): boolean {
		return this.config.get<boolean>('serviceWorker.apiKey')
	}
}
