/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	MutationInitiatePasswordResetArgs,
	VoidResponse
} from '@cbosuite/schema/dist/provider-types'
import { UserInputError } from 'apollo-server-errors'
import { Transporter } from 'nodemailer'
import { Configuration, Localization } from '~components'
import { TokenIssuer } from '~components/TokenIssuer'
import { UserCollection } from '~db'
import { Interactor, RequestContext } from '~types'
import { getForgotPasswordHTMLTemplate, createLogger } from '~utils'
import { SuccessVoidResponse } from '~utils/response'

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

	public async execute(
		{ email }: MutationInitiatePasswordResetArgs,
		{ locale }: RequestContext
	): Promise<VoidResponse> {
		const { item: user } = await this.users.item({ email })

		if (!user) {
			throw new UserInputError(
				this.localization.t('mutation.forgotUserPassword.userNotFound', locale)
			)
		}

		if (!this.config.isEmailEnabled && this.config.failOnMailNotEnabled) {
			throw new Error(this.localization.t('mutation.forgotUserPassword.emailNotConfigured', locale))
		}

		const forgotPasswordToken = await this.tokenIssuer.issuePasswordResetToken(user)
		if (!forgotPasswordToken) {
			throw new Error(this.localization.t('mutation.forgotUserPassword.couldNotIssueToken', locale))
		}
		await this.users.setPasswordResetTokenForUser(user, forgotPasswordToken)

		let successMessage = this.localization.t('mutation.forgotUserPassword.success', locale)
		const resetLink = `${this.config.origin}/passwordReset?resetToken=${forgotPasswordToken}`
		if (this.config.isEmailEnabled) {
			try {
				await this.mailer.sendMail({
					from: `${this.localization.t('mutation.forgotUserPassword.emailHTML.header', locale)} "${
						this.config.defaultFromAddress
					}"`,
					to: user.email,
					subject: this.localization.t('mutation.forgotUserPassword.emailSubject', locale),
					text: this.localization.t('mutation.forgotUserPassword.emailBody', locale, {
						forgotPasswordToken
					}),
					html: getForgotPasswordHTMLTemplate(resetLink, locale, this.localization)
				})
			} catch (error) {
				logger('error sending mail', error)
				throw new Error(
					this.localization.t('mutation.forgotUserPassword.emailNotConfigured', locale)
				)
			}
		} else {
			// return temp password to display in console log.
			successMessage = `SUCCESS_NO_MAIL: ${resetLink}`
		}

		return new SuccessVoidResponse(successMessage)
	}
}
