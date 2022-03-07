/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Transporter } from 'nodemailer'
import { createTransport } from 'nodemailer'
import type { Configuration } from '~components/Configuration'
const sgTransport = require('nodemailer-sendgrid-transport')

export class MailerProvider {
	private mailer: Transporter

	public constructor(config: Configuration) {
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
