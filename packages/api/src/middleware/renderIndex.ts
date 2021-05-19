/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Configuration } from '~components/Configuration'

export function renderIndex(config: Configuration): string {
	return `
<body>
	<h1>Greenlight API</h1>
	<ul>
		<li><a href="/health">Health</a></li>
		${config.graphiql ? '<li><a href="/playground">Playground</a></li>' : ''}
	</ul>
</body>
`
}
