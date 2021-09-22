/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const config = require('config')

const environment = {
	'process.env.API_URL': config.get('api.url'),
	'process.env.API_SOCKET_URL': config.get('api.socketUrl'),
	'process.env.APPLICATION_INSIGHTS_INSTRUMENTATION_KEY': config.get('applicationInsights.key'),
	'process.env.APPLICATION_INSIGHTS_DEBUG': config.get('applicationInsights.debug'),
	'process.env.CONTACT_US_EMAIL': config.get('site.contactUsEmail'),
	'process.env.SITE_COPYRIGHT_HOLDER': config.get('site.copyrightHolder'),
	'process.env.PRIVACY_POLICY_URL': config.get('site.privacyPolicyUrl'),
	'process.env.TERMS_OF_USE_URL': config.get('site.termsOfUseUrl'),
	'process.env.TRADEMARKS_URL': config.get('site.trademarksUrl')
}

console.log('exporting environment', environment)
module.exports = environment
