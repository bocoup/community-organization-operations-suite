/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export const features: Record<string, boolean> = {}

export const constants = {
	contactUsEmail: process.env.CONTACT_US_EMAIL || '',
	codeOfConductUrl: process.env.CODE_OF_CONDUCT_URL || '',
	privacyUrl: process.env.PRIVACY_POLICY_URL || '',
	termsOfUseUrl: process.env.TERMS_OF_USE_URL || '',
	trademarksUrl: process.env.TRADEMARKS_URL || '',
	copyright: `©️ ${new Date().getFullYear()} ${process.env.SITE_COPYRIGHT_HOLDER}`
}
