/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Transporter, createTransport } from 'nodemailer'
import { Configuration } from '~components'
const sgTransport = require('nodemailer-sendgrid-transport')

export class MailerProvider {
	private readonly mailer: Transporter

	public constructor(readonly config: Configuration) {
		this.mailer = createTransport(
			sgTransport({
				auth: {
					api_key: config.sendgridApiKey
				}
			})
		)
	}

	public get(): Transporter {
		return this.mailer
	}
}
