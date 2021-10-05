/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { config } from '~utils/config'
export const features: Record<string, boolean> = {}

export const constants = {
	contactUsEmail: config.site.contactUsEmail || '',
	codeOfConductUrl: config.site.codeOfConductUrl || '',
	privacyUrl: config.site.privacyPolicyUrl || '',
	termsOfUseUrl: config.site.termsOfUseUrl || '',
	trademarksUrl: config.site.trademarksUrl || '',
	copyright: `©️ ${new Date().getFullYear()} ${config.site.copyrightHolder}`
}
