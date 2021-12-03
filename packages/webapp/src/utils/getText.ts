/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { createLogger } from './createLogger'

const logger = createLogger('getText')

export async function getText(locale: string): Promise<any | undefined> {
	try {
		// TODO: Move this logic into a util... it will need to be called on every page... or move it to _app.tsx?
		const intlResponse: { default: any } = await import(`../intl/${locale}.json`)
		logger('intlResponse', intlResponse.default)

		return intlResponse
	} catch (error) {
		logger('error', error)
	}

	return
}
