/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
require('dotenv').config()
const config = require('config')

const defines = {
	config: config.util.toObject(config)
}

console.log(`exporting defines ${process.env.NODE_CONFIG_ENV}`, defines)
module.exports = defines
