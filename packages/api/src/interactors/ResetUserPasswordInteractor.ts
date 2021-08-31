/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { StatusType, UserActionResponse, UserIdInput } from '@cbosuite/schema/dist/provider-types'
import { Transporter } from 'nodemailer'
import { Authenticator, Configuration, Localization } from '~components'
import { UserCollection } from '~db'
import { createGQLUser } from '~dto'
import { Interactor } from '~types'
import { getPasswordResetHTMLTemplate, isSendMailConfigured } from '~utils'

export class ResetUserPasswordInteractor implements Interactor<UserIdInput, UserActionResponse> {
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

	public async execute(body: UserIdInput): Promise<UserActionResponse> {
		const { userId: id } = body
		const user = await this.#users.itemById(id)

		if (!user.item) {
			return {
				user: null,
				message: this.#localization.t('mutation.resetUserPassword.userNotFound'),
				status: StatusType.Failed
			}
		}

		// If env is production and sendmail is not configured, don't reset user password.
		if (
			!isSendMailConfigured(this.#config) &&
			process.env.NODE_ENV?.toLowerCase() === 'production'
		) {
			return {
				user: null,
				message: this.#localization.t('mutation.resetUserPassword.emailNotConfigured'),
				status: StatusType.Failed
			}
		}

		const password = await this.#authenticator.resetPassword(user.item)

		if (!password) {
			return {
				user: null,
				message: this.#localization.t('mutation.resetUserPassword.resetError'),
				status: StatusType.Failed
			}
		}

		let successMessage = this.#localization.t('mutation.resetUserPassword.success')
		if (isSendMailConfigured(this.#config)) {
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
				console.error('error sending mail', error)
				return {
					user: null,
					message: this.#localization.t('mutation.resetUserPassword.emailNotConfigured'),
					status: StatusType.Failed
				}
			}
		} else {
			console.error('sendmail is not configured')
			// return temp password to display in console log.
			successMessage = `SUCCESS_NO_MAIL: account temporary password: ${password}`
		}

		return {
			user: createGQLUser(user.item),
			message: successMessage,
			status: StatusType.Success
		}
	}
}
