/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createLogger } from '~utils/createLogger'
const log = createLogger('config')
declare const __CONFIG__: any
export interface FeatureFlag {
	enabled: boolean
}
export interface Config {
	origin: string
	api: {
		url: string
		socketUrl: string
	}
	applicationInsights: {
		key: string
		debug: boolean
	}
	site: {
		contactUsEmail: string
		copyrightHolder: string
		privacyPolicyUrl: string
		termsOfUseUrl: string
		trademarksUrl: string
		codeOfConductUrl: string
		version: string
		isOffline: boolean
	}
	firebase: {
		apiKey: string | null
		authDomain: string | null
		projectId: string | null
		storageBucket: string | null
		messagingSenderId: string | null
		appId: string | null
		measurementId: string | null
		fcmVapidServerKey: string | null
	}
	features: {
		complianceModal: FeatureFlag
		durableCache: FeatureFlag
		serviceWorker: FeatureFlag
		debugToastFailure: FeatureFlag
		devLogger: FeatureFlag
		devCallbacks: FeatureFlag
		inAppNotifications: FeatureFlag
		redbox: FeatureFlag & { behavior: string | null }
		beacon: FeatureFlag & { key: string | null }
	}
}

export const config: Config = Object.freeze(__CONFIG__)
log(config)
