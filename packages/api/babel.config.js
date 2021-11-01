/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// this is mainly used for on-the-fly test transpilation
module.exports = {
	presets: [
		require('@babel/preset-typescript'),
		[
			require('@babel/preset-env'),
			{
				modules: 'cjs',
				targets: { node: 'current' },
				useBuiltIns: 'usage',
				corejs: 3,
				loose: true
			}
		]
	],
	plugins: [
		require('@babel/plugin-proposal-object-rest-spread'),
		require('@babel/plugin-proposal-optional-chaining'),
		require('@babel/plugin-proposal-nullish-coalescing-operator'),
		[
			require('@babel/plugin-proposal-decorators'),
			{
				legacy: true
			}
		],

		[require('@babel/plugin-proposal-class-properties'), { loose: true }]
	]
}
