/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { UserIdInput, UserResponse } from '@cbosuite/schema/dist/provider-types'
import { Transporter } from 'nodemailer'
import { Authenticator, Configuration, Localization } from '~components'
import { UserCollection } from '~db'
import { createGQLUser } from '~dto'
import { Interactor } from '~types'
import { getPasswordResetHTMLTemplate, createLogger } from '~utils'
import { FailedResponse, SuccessUserResponse } from '~utils/response'

const logger = createLogger('interactors:reset-user-password')

export class ResetUserPasswordInteractor implements Interactor<UserIdInput, UserResponse> {
	#localization: Localization
	#config: Configuration
	#authenticator: Authenticator
	#mailer: Transporter
	#users: UserCollection

	public constructor(
		localization: Localization,
		config: Configuration,
		authenticator: Authenticator,
		mailer: Transporter,
		users: UserCollection
	) {
		this.#localization = localization
		this.#config = config
		this.#authenticator = authenticator
		this.#mailer = mailer
		this.#users = users
	}

	public async execute(body: UserIdInput): Promise<UserResponse> {
		const { userId: id } = body
		const user = await this.#users.itemById(id)

		if (!user.item) {
			return new FailedResponse(this.#localization.t('mutation.resetUserPassword.userNotFound'))
		}

		// If env is production and sendmail is not configured, don't reset user password.
		if (!this.#config.isEmailEnabled && this.#config.failOnMailNotEnabled) {
			return new FailedResponse(
				this.#localization.t('mutation.resetUserPassword.emailNotConfigured')
			)
		}

		const password = await this.#authenticator.resetPassword(user.item)

		if (!password) {
			return new FailedResponse(this.#localization.t('mutation.resetUserPassword.resetError'))
		}

		let successMessage = this.#localization.t('mutation.resetUserPassword.success')
		if (this.#config.isEmailEnabled) {
			try {
				await this.#mailer.sendMail({
					from: `${this.#localization.t('mutation.resetUserPassword.emailHTML.header')} "${
						this.#config.defaultFromAddress
					}"`,
					to: user.item.email,
					subject: this.#localization.t('mutation.resetUserPassword.emailSubject'),
					text: this.#localization.t('mutation.resetUserPassword.emailBody', {
						password
					}),
					html: getPasswordResetHTMLTemplate(password, this.#localization)
				})
			} catch (error) {
				logger('error sending mail', error)
				return new FailedResponse(
					this.#localization.t('mutation.resetUserPassword.emailNotConfigured')
				)
			}
		} else {
			logger('sendmail is not configured')
			// return temp password to display in console log.
			successMessage = `SUCCESS_NO_MAIL: account temporary password: ${password}`
		}

		return new SuccessUserResponse(successMessage, createGQLUser(user.item))
	}
}
