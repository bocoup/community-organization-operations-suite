/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationResetUserPasswordArgs, UserResponse } from '@cbosuite/schema/dist/provider-types'
import { Transporter } from 'nodemailer'
import { Authenticator, Configuration, Localization } from '~components'
import { UserCollection } from '~db'
import { createGQLUser } from '~dto'
import { Interactor, RequestContext } from '~types'
import { getPasswordResetHTMLTemplate, createLogger } from '~utils'
import { FailedResponse, SuccessUserResponse } from '~utils/response'

const logger = createLogger('interactors:reset-user-password')

export class ResetUserPasswordInteractor
	implements Interactor<MutationResetUserPasswordArgs, UserResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly config: Configuration,
		private readonly authenticator: Authenticator,
		private readonly mailer: Transporter,
		private readonly users: UserCollection
	) {}

	public async execute(
		{ userId: id }: MutationResetUserPasswordArgs,
		{ locale }: RequestContext
	): Promise<UserResponse> {
		const user = await this.users.itemById(id)
		if (!user.item) {
			return new FailedResponse(
				this.localization.t('mutation.resetUserPassword.userNotFound', locale)
			)
		}

		// If env is production and sendmail is not configured, don't reset user password.
		if (!this.config.isEmailEnabled && this.config.failOnMailNotEnabled) {
			return new FailedResponse(
				this.localization.t('mutation.resetUserPassword.emailNotConfigured', locale)
			)
		}

		const password = await this.authenticator.resetPassword(user.item)

		if (!password) {
			return new FailedResponse(
				this.localization.t('mutation.resetUserPassword.resetError', locale)
			)
		}

		let successMessage = this.localization.t('mutation.resetUserPassword.success', locale)
		if (this.config.isEmailEnabled) {
			try {
				await this.mailer.sendMail({
					from: `${this.localization.t('mutation.resetUserPassword.emailHTML.header', locale)} "${
						this.config.defaultFromAddress
					}"`,
					to: user.item.email,
					subject: this.localization.t('mutation.resetUserPassword.emailSubject', locale),
					text: this.localization.t('mutation.resetUserPassword.emailBody', locale, {
						password
					}),
					html: getPasswordResetHTMLTemplate(password, this.localization)
				})
			} catch (error) {
				logger('error sending mail', error)
				return new FailedResponse(
					this.localization.t('mutation.resetUserPassword.emailNotConfigured', locale)
				)
			}
		} else {
			logger('sendmail is not configured')
			// return temp password to display in console log.
			successMessage = `SUCCESS_NO_MAIL: account temporary password: ${password}`
		}

		return new SuccessUserResponse(successMessage, createGQLUser(user.item, true))
	}
}
