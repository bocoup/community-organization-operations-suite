/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ForgotUserPasswordInput,
	ForgotUserPasswordResponse,
	StatusType
} from '@cbosuite/schema/dist/provider-types'
import { Transporter } from 'nodemailer'
import { Authenticator, Configuration, Localization } from '~components'
import { UserCollection } from '~db'
import { Interactor } from '~types'
import { getForgotPasswordHTMLTemplate, createLogger } from '~utils'

const logger = createLogger('interactors:forgot-user-password')

export class ForgotUserPasswordInteractor
	implements Interactor<ForgotUserPasswordInput, ForgotUserPasswordResponse>
{
	#config: Configuration
	#localization: Localization
	#users: UserCollection
	#authenticator: Authenticator
	#mailer: Transporter

	public constructor(
		config: Configuration,
		localization: Localization,
		authenticator: Authenticator,
		users: UserCollection,
		mailer: Transporter
	) {
		this.#config = config
		this.#localization = localization
		this.#users = users
		this.#authenticator = authenticator
		this.#mailer = mailer
	}

	public async execute(body: ForgotUserPasswordInput): Promise<ForgotUserPasswordResponse> {
		const { email } = body
		const user = await this.#users.item({ email })

		if (!user.item) {
			return {
				status: StatusType.Failed,
				message: this.#localization.t('mutation.forgotUserPassword.userNotFound')
			}
		}

		if (!this.#config.isEmailEnabled && this.#config.failOnMailNotEnabled) {
			return {
				message: this.#localization.t('mutation.forgotUserPassword.emailNotConfigured'),
				status: StatusType.Failed
			}
		}
		//const forgotPasswordToken = this.#authenticator.generatePassword(25, true)
		const forgotPasswordToken = this.#authenticator.generatePasswordResetToken()

		await this.#users.updateItem(
			{ email: email },
			{
				$set: {
					forgot_password_token: forgotPasswordToken
				}
			}
		)

		let successMessage = this.#localization.t('mutation.forgotUserPassword.success')
		const resetLink = `${
			this.#config.origin
		}/passwordReset?email=${email}&resetToken=${forgotPasswordToken}`
		if (this.#config.isEmailEnabled) {
			try {
				await this.#mailer.sendMail({
					from: `${this.#localization.t('mutation.forgotUserPassword.emailHTML.header')} "${
						this.#config.defaultFromAddress
					}"`,
					to: user.item.email,
					subject: this.#localization.t('mutation.forgotUserPassword.emailSubject'),
					text: this.#localization.t('mutation.forgotUserPassword.emailBody', {
						forgotPasswordToken
					}),
					html: getForgotPasswordHTMLTemplate(resetLink, this.#localization)
				})
			} catch (error) {
				logger('error sending mail', error)
				return {
					status: StatusType.Failed,
					message: this.#localization.t('mutation.forgotUserPassword.emailNotConfigured')
				}
			}
		} else {
			// return temp password to display in console log.
			successMessage = `SUCCESS_NO_MAIL: password reset link: ${resetLink}`
		}

		return {
			status: StatusType.Success,
			message: successMessage
		}
	}
}
