/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
module.exports = {
	extends: ['@essex/eslint-config'],
	rules: {
		// we use custom tsconfig paths
		'import/no-unresolved': 0,

		// TODO: Re-enable
		'jsx-a11y/click-events-have-key-events': 0,
		'jsx-a11y/no-static-element-interactions': 0,
	},
}
