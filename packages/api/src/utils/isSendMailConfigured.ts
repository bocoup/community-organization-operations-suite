/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Configuration } from '~components'

export function isSendMailConfigured(config: Configuration): boolean {
	const mailConfig = config.smtpDetails
	return (
		!!mailConfig?.host && !!mailConfig?.port && !!mailConfig?.auth?.user && !!mailConfig?.auth?.pass
	)
}
