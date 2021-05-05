/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const env = require('./env-config')

module.exports = {
	presets: ['next/babel'],
	plugins: [['transform-define', env]]
}
