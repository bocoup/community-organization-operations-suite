/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
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
		redbox: FeatureFlag & { behavior?: string }
	}
}

const configuration: Config = __CONFIG__
export default configuration
