/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { UserInput, UserResponse } from '@cbosuite/schema/dist/provider-types'
import { Transporter } from 'nodemailer'
import { Authenticator, Configuration, Localization } from '~components'
import { OrganizationCollection, UserCollection } from '~db'
import { createDBUser, createGQLUser } from '~dto'
import { Interactor } from '~types'
import { getAccountCreatedHTMLTemplate, createLogger } from '~utils'
import { FailedResponse, SuccessUserResponse } from '~utils/response'

const logger = createLogger('interactors:create-new-user')

export class CreateNewUserInteractor implements Interactor<UserInput, UserResponse> {
	#localization: Localization
	#authenticator: Authenticator
	#mailer: Transporter
	#users: UserCollection
	#orgs: OrganizationCollection
	#config: Configuration
	public constructor(
		localization: Localization,
		authenticator: Authenticator,
		mailer: Transporter,
		users: UserCollection,
		orgs: OrganizationCollection,
		config: Configuration
	) {
		this.#localization = localization
		this.#authenticator = authenticator
		this.#mailer = mailer
		this.#users = users
		this.#orgs = orgs
		this.#config = config
	}

	public async execute(user: UserInput): Promise<UserResponse> {
		const checkUser = await this.#users.count({
			email: user.email
		})

		if (checkUser !== 0) {
			return new FailedResponse(this.#localization.t('mutation.createNewUser.emailExist'))
		}

		// If env is production and sendmail is not configured, don't create user.
		if (!this.#config.isEmailEnabled && this.#config.failOnMailNotEnabled) {
			return new FailedResponse(this.#localization.t('mutation.createNewUser.emailNotConfigured'))
		}

		// Generate random password
		const password = this.#authenticator.generatePassword(16)

		// Create a dbabase object from input values
		const newUser = createDBUser(user, password)

		await Promise.all([
			this.#users.insertItem(newUser),
			this.#orgs.updateItem({ id: newUser.roles[0].org_id }, { $push: { users: newUser.id } })
		])

		let successMessage = this.#localization.t('mutation.createNewUser.success')
		const loginLink = `${this.#config.origin}/login`
		if (this.#config.isEmailEnabled) {
			try {
				await this.#mailer.sendMail({
					from: `${this.#localization.t('mutation.createNewUser.emailHTML.header')} "${
						this.#config.defaultFromAddress
					}"`,
					to: user.email,
					subject: this.#localization.t('mutation.createNewUser.emailSubject'),
					text: this.#localization.t('mutation.createNewUser.emailBody', { password }),
					html: getAccountCreatedHTMLTemplate(loginLink, password, this.#localization)
				})
			} catch (error) {
				logger('error sending mail', error)
				return new FailedResponse(this.#localization.t('mutation.createNewUser.emailNotConfigured'))
			}
		} else {
			// return temp password to display in console log.
			successMessage = `SUCCESS_NO_MAIL: account temporary password: ${password}`
		}

		return new SuccessUserResponse(successMessage, createGQLUser(newUser))
	}
}
