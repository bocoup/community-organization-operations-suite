/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import fs from 'fs'

/**
 * Retrieves the GraphQL Schema Specification
 */
export function getSchema(): string {
	const result = fs.readFileSync(require.resolve('@cbosuite/schema/schema.gql'), {
		encoding: 'utf-8'
	})
	if (result.length === 0) {
		throw new Error('empty schema detected')
	}
	return result
}
