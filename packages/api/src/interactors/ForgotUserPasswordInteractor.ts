/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ForgotUserPasswordInput, VoidResponse } from '@cbosuite/schema/dist/provider-types'
import { Transporter } from 'nodemailer'
import { Authenticator, Configuration, Localization } from '~components'
import { UserCollection } from '~db'
import { Interactor } from '~types'
import { getForgotPasswordHTMLTemplate, createLogger } from '~utils'
import { FailedResponse, SuccessVoidResponse } from '~utils/response'

const logger = createLogger('interactors:forgot-user-password')

export class ForgotUserPasswordInteractor
	implements Interactor<ForgotUserPasswordInput, VoidResponse>
{
	public constructor(
		private readonly config: Configuration,
		private readonly localization: Localization,
		private readonly authenticator: Authenticator,
		private readonly users: UserCollection,
		private readonly mailer: Transporter
	) {}

	public async execute(body: ForgotUserPasswordInput): Promise<VoidResponse> {
		const { email } = body
		const user = await this.users.item({ email })

		if (!user.item) {
			return new FailedResponse(this.localization.t('mutation.forgotUserPassword.userNotFound'))
		}

		if (!this.config.isEmailEnabled && this.config.failOnMailNotEnabled) {
			return new FailedResponse(
				this.localization.t('mutation.forgotUserPassword.emailNotConfigured')
			)
		}
		//const forgotPasswordToken = this.authenticator.generatePassword(25, true)
		const forgotPasswordToken = this.authenticator.generatePasswordResetToken()

		await this.users.updateItem(
			{ email: email },
			{
				$set: {
					forgot_password_token: forgotPasswordToken
				}
			}
		)

		let successMessage = this.localization.t('mutation.forgotUserPassword.success')
		const resetLink = `${this.config.origin}/passwordReset?email=${email}&resetToken=${forgotPasswordToken}`
		if (this.config.isEmailEnabled) {
			try {
				await this.mailer.sendMail({
					from: `${this.localization.t('mutation.forgotUserPassword.emailHTML.header')} "${
						this.config.defaultFromAddress
					}"`,
					to: user.item.email,
					subject: this.localization.t('mutation.forgotUserPassword.emailSubject'),
					text: this.localization.t('mutation.forgotUserPassword.emailBody', {
						forgotPasswordToken
					}),
					html: getForgotPasswordHTMLTemplate(resetLink, this.localization)
				})
			} catch (error) {
				logger('error sending mail', error)
				return new FailedResponse(
					this.localization.t('mutation.forgotUserPassword.emailNotConfigured')
				)
			}
		} else {
			// return temp password to display in console log.
			successMessage = `SUCCESS_NO_MAIL: password reset link: ${resetLink}`
		}

		return new SuccessVoidResponse(successMessage)
	}
}
