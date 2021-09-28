/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import fs from 'fs'

export function dumpDomNode(element: Element, filename = 'test-output.html') {
	fs.writeFileSync(filename, element.innerHTML, { encoding: 'utf8' })
}
