/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	MutationInitiatePasswordResetArgs,
	VoidResponse
} from '@cbosuite/schema/dist/provider-types'
import { Transporter } from 'nodemailer'
import { Configuration, Localization } from '~components'
import { TokenIssuer } from '~components/TokenIssuer'
import { UserCollection } from '~db'
import { Interactor } from '~types'
import { getForgotPasswordHTMLTemplate, createLogger } from '~utils'
import { FailedResponse, SuccessVoidResponse } from '~utils/response'

const logger = createLogger('interactors:forgot-user-password')

export class InitiatePasswordResetInteractor
	implements Interactor<MutationInitiatePasswordResetArgs, VoidResponse>
{
	public constructor(
		private readonly config: Configuration,
		private readonly localization: Localization,
		private readonly tokenIssuer: TokenIssuer,
		private readonly users: UserCollection,
		private readonly mailer: Transporter
	) {}

	public async execute({ email }: MutationInitiatePasswordResetArgs): Promise<VoidResponse> {
		const { item: user } = await this.users.item({ email })

		if (!user) {
			return new FailedResponse(this.localization.t('mutation.forgotUserPassword.userNotFound'))
		}

		if (!this.config.isEmailEnabled && this.config.failOnMailNotEnabled) {
			return new FailedResponse(
				this.localization.t('mutation.forgotUserPassword.emailNotConfigured')
			)
		}

		const forgotPasswordToken = await this.tokenIssuer.issuePasswordResetToken(user)
		if (!forgotPasswordToken) {
			return new FailedResponse(
				this.localization.t('mutation.forgotUserPassword.couldNotIssueToken')
			)
		}
		await this.users.setPasswordResetTokenForUser(user, forgotPasswordToken)

		let successMessage = this.localization.t('mutation.forgotUserPassword.success')
		const resetLink = `${this.config.origin}/passwordReset?resetToken=${forgotPasswordToken}`
		if (this.config.isEmailEnabled) {
			try {
				await this.mailer.sendMail({
					from: `${this.localization.t('mutation.forgotUserPassword.emailHTML.header')} "${
						this.config.defaultFromAddress
					}"`,
					to: user.email,
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
			successMessage = `SUCCESS_NO_MAIL: ${resetLink}`
		}

		return new SuccessVoidResponse(successMessage)
	}
}
