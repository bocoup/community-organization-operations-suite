/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const path = require('path')

module.exports = {
	process(src, filename, config, options) {
		return 'module.exports = ' + JSON.stringify(path.basename(filename)) + ';'
	}
}
