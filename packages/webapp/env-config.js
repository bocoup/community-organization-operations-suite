/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
require('dotenv').config()
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
	'process.env.TRADEMARKS_URL': config.get('site.trademarksUrl'),
	'process.env.FIREBASE_API_KEY': config.get('firebase.apiKey'),
	'process.env.FIREBASE_AUTH_DOMAIN': config.get('firebase.authDomain'),
	'process.env.FIREBASE_PROJECT_ID': config.get('firebase.projectId'),
	'process.env.FIREBASE_STORAGE_BUCKET': config.get('firebase.storageBucket'),
	'process.env.FIREBASE_MESSAGING_SENDER_ID': config.get('firebase.messagingSenderId'),
	'process.env.FIREBASE_APP_ID': config.get('firebase.appId'),
	'process.env.FIREBASE_MEASUREMENT_ID': config.get('firebase.measurementId'),
	'process.env.FIREBASE_VAPID_SERVER_KEY': config.get('firebase.fcmVapidServerKey'),
	'process.env.ENABLE_DURABLE_CACHE': config.get('features.durableCache.enabled')
}

console.log(`exporting environment ${process.env.NODE_CONFIG_ENV}`, environment)
module.exports = environment
