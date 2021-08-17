/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const inDev = (callBack?: () => void): void | boolean => {
	if (callBack) {
		if (process.env.NODE_ENV === 'development') callBack()
		return
	} else {
		return process.env.NODE_ENV === 'development'
	}
}

export default inDev
