/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import fs from 'fs'

export function getSchema(): string {
	return fs.readFileSync(require.resolve('@greenlight/schema/schema.gql'), {
		encoding: 'utf-8',
	})
}
