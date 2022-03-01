/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import printJS from 'print-js'

export function usePrinter() {
	const print = useCallback(function print(
		printableJsonData: Array<any>,
		printableFields: Array<string>
	) {
		printJS({
			printable: printableJsonData,
			type: 'json',
			properties: printableFields,
			style: '@page { size: landscape; }'
		})
	},
	[])

	return {
		print
	}
}
