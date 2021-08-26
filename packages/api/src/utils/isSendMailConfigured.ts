/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Configuration } from '~components'

export function isSendMailConfigured(config: Configuration): boolean {
	return !!config.sendgridApiKey
}
