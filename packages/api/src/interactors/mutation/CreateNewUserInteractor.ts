/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationCreateNewUserArgs, UserResponse } from '@cbosuite/schema/dist/provider-types'
import { UserInputError, ForbiddenError } from 'apollo-server-errors'
import { createDBUser, createGQLUser } from '~dto'
import { Interactor, RequestContext } from '~types'
import { getAccountCreatedHTMLTemplate, createLogger, generatePassword } from '~utils'
import { SuccessUserResponse } from '~utils/response'
import { singleton } from 'tsyringe'
import { Localization } from '~components/Localization'
import { MailerProvider } from '~components/MailerProvider'
import { UserCollection } from '~db/UserCollection'
import { Configuration } from '~components/Configuration'
import { Telemetry } from '~components/Telemetry'

const logger = createLogger('interactors:create-new-user')

@singleton()
export class CreateNewUserInteractor
	implements Interactor<unknown, MutationCreateNewUserArgs, UserResponse>
{
	private mailer: MailerProvider

	public constructor(
		private localization: Localization,
		private users: UserCollection,
		private config: Configuration,
		private telemetry: Telemetry
	) {
		this.mailer = new MailerProvider(config)
	}

	public async execute(
		_: unknown,
		{ user }: MutationCreateNewUserArgs,
		{ locale, identity }: RequestContext
	): Promise<UserResponse> {
		if (!identity?.id) throw new ForbiddenError('not authenticated')
		const checkUser = await this.users.count({
			email: user.email
		})

		if (checkUser !== 0) {
			throw new UserInputError(this.localization.t('mutation.createNewUser.emailExist', locale))
		}

		// If env is production and sendmail is not configured, don't create user.
		if (!this.config.isEmailEnabled && this.config.failOnMailNotEnabled) {
			throw new Error(this.localization.t('mutation.createNewUser.emailNotConfigured', locale))
		}

		// Generate random password
		const password = generatePassword(16)

		// Create a dbabase object from input values
		const newUser = createDBUser(user, password, identity.id)

		await Promise.all([this.users.insertItem(newUser)])

		let successMessage = this.localization.t('mutation.createNewUser.success', locale)
		const loginLink = `${this.config.origin}/login`
		if (this.config.isEmailEnabled) {
			try {
				await this.mailer.get().sendMail({
					from: `${this.localization.t('mutation.createNewUser.emailHTML.header', locale)} "${
						this.config.defaultFromAddress
					}"`,
					to: user.email,
					subject: this.localization.t('mutation.createNewUser.emailSubject', locale),
					text: this.localization.t('mutation.createNewUser.emailBody', locale, { password }),
					html: getAccountCreatedHTMLTemplate(loginLink, password, locale, this.localization)
				})
			} catch (error) {
				logger('error sending mail', error)
				throw new Error(this.localization.t('mutation.createNewUser.emailNotConfigured', locale))
			}
		} else {
			// return temp password to display in console log.
			successMessage = `SUCCESS_NO_MAIL: account temporary password: ${password}`
		}

		this.telemetry.trackEvent('CreateNewUser')
		return new SuccessUserResponse(successMessage, createGQLUser(newUser, true))
	}
}
