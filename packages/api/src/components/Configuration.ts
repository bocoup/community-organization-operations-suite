/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import config, { IConfig } from 'config'

/**
 * Server Configuration
 */
export class Configuration {
	public constructor(private c: IConfig = config) {}

	public validate(): void {
		if (this.dbConnectionString == null) {
			throw new Error('DB_CONNECTION_STRING must be defined')
		}
	}

	public get graphiql(): boolean | string {
		return this.c.get<boolean | string>('server.graphiql')
	}

	public get port(): number {
		return this.c.get<number>('server.port')
	}

	public get host(): string {
		return this.c.get<string>('server.host')
	}

	public get prettyLogging(): boolean {
		return this.c.get<boolean>('logging.pretty')
	}

	public get dbConnectionString(): string {
		return this.c.get<string>('db.connectionString')
	}

	public get dbDatabase(): string {
		return this.c.get<string>('db.database')
	}

	public get dbUsersCollection(): string {
		return this.c.get<string>('db.usersCollection')
	}

	public get dbOrganizationsCollection(): string {
		return this.c.get<string>('db.organizationsCollection')
	}

	public get dbContactsCollection(): string {
		return this.c.get<string>('db.contactsCollection')
	}
}
