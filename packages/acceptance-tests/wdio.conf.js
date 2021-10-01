/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
require('ts-node/register')
require('dotenv').config()
const { config } = require('./wdio.conf.ts')
exports.config = config
