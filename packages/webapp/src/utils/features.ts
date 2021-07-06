/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export const features = {
	pilotFeedbackLink: true
}

const pilotFeedbackEmail = 'intakeprototype@googlegroups.com'
export const constants = {
	pilotFeedbackEmail,
	contactUsEmail: process.env.CONTACT_US_EMAIL || pilotFeedbackEmail,
	codeOfConductUrl: process.env.CODE_OF_CONDUCT_URL || '',
	privacyUrl: 'https://go.microsoft.com/fwlink/?LinkId=521839',
	termsOfUseUrl: 'https://go.microsoft.com/fwlink/?LinkID=206977',
	trademarksUrl: 'https://www.microsoft.com/trademarks',
	copyright: `©️ ${new Date().getFullYear()} Microsoft`
}
