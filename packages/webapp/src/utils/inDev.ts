/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const inDev = (callBack?: () => void): void | boolean => {
	if (callBack) {
		if (config.features.devCallbacks.enabled) {
			callBack()
		}
		return
	} else {
		return config.features.devCallbacks.enabled
	}
}

export default inDev
