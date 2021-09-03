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

	/**
	 * Validate that required environment variables have bene set
	 */
	public validate(): void {
		if (this.dbConnectionString == null) {
			throw new Error('DB_CONNECTION_STRING must be defined')
		}
		if (this.jwtTokenSecret == null) {
			throw new Error('JWT_SECRET must be defined')
		}
		if (!this.sendgridApiKey) {
			console.warn('SENDGRID_API_KEY is not set, mail disabled')
		}
		if (!this.defaultFromAddress) {
			console.warn('EMAIL_FROM is not set, mail disabled')
		}
	}

	public get introspection(): boolean | undefined {
		return this.c.get<boolean | undefined>('server.introspection')
	}

	public get port(): number {
		return this.c.get<number>('server.port')
	}

	public get host(): string {
		return this.c.get<string>('server.host')
	}

	public get origin(): string {
		return this.c.get<string>('server.origin')
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

	public get dbUserTokensCollection(): string {
		return this.c.get<string>('db.userTokensCollection')
	}

	public get dbOrganizationsCollection(): string {
		return this.c.get<string>('db.organizationsCollection')
	}

	public get dbEngagementsCollection(): string {
		return this.c.get<string>('db.engagementsCollection')
	}

	public get dbTagsCollection(): string {
		return this.c.get<string>('db.tagsCollection')
	}

	public get dbContactsCollection(): string {
		return this.c.get<string>('db.contactsCollection')
	}
	public get dbServicesCollection(): string {
		return this.c.get<string>('db.servicesCollection')
	}

	public get defaultPageOffset(): number {
		return this.c.get<number>('constants.defaultPageOffset')
	}

	public get defaultPageLimit(): number {
		return this.c.get<number>('constants.defaultPageLimit')
	}

	public get jwtTokenSecret(): string {
		return this.c.get<string>('security.jwtSecret')
	}

	public get sendgridApiKey(): any {
		return this.c.get<string>('email.sendgridApiKey')
	}

	public get defaultFromAddress(): string {
		return this.c.get<string>('email.from')
	}

	public get firebaseSettings(): any {
		return this.c.get<any>('firebase')
	}

	public get failOnMailNotEnabled(): boolean {
		return this.c.get<boolean>('email.failOnMailNotEnabled')
	}

	public get isEmailEnabled(): boolean {
		return !!this.sendgridApiKey
	}
}
