/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
interface FeatureFlag {
	enabled: boolean
}

declare const config: {
	origin: string
	api: {
		url: string
		socketUrl: string
	}
	applicationInsights: {
		key: string
		debug: boolean
	}
	next: {
		assetPrefix: string
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
	}
}
