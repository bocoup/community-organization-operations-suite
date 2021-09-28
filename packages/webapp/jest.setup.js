/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
require('dotenv').config()
const { setIconOptions } = require('@fluentui/react/lib-commonjs/Styling')

// Suppress icon warnings.
setIconOptions({
	disableWarnings: true
})

require('jest-fetch-mock').enableMocks()
