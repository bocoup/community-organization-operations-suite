/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const prod = process.env.NODE_ENV === 'production'

module.exports = {
	'process.env.BACKEND_URL': prod ? '' : ''
}
