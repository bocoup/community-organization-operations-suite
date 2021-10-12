/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import path from 'path'
import fs from 'fs'

export function writeCollectionData(file: string, items: unknown[]): void {
	const outputFilename = path.join('mock_data', `${file}.json`)
	const content = items.map((o) => JSON.stringify(o)).join('\n')
	fs.writeFileSync(outputFilename, content, { encoding: 'utf-8' })
}
