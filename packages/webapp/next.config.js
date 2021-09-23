/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// This file is not going through babel transformation.
// So, we write it in vanilla JS
// (But you could use ES2015 features supported by your Node.js version)
const withPWA = require('next-pwa')
const config = require('config')

module.exports = withPWA({
	assetPrefix: config.get('next.assetPrefix'),
	trailingSlash: true,
	webpack5: true,
	pwa: {
		dest: 'public'
	}
})
