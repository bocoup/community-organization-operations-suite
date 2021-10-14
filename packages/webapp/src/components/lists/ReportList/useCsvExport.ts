/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useRef } from 'react'
import { empty } from '~utils/noop'
import { CsvField } from './types'
import { Parser } from 'json2csv/dist/json2csv.umd'
import { downloadFile } from '~utils/downloadFile'

export function useCsvExport(data: unknown[]) {
	const csvFields = useRef<CsvField[]>(empty)
	const setCsvFields = useCallback((a: CsvField[]) => {
		csvFields.current = a
	}, [])
	const downloadCSV = useCallback(
		function downloadCSV() {
			const fields = csvFields.current
			const parser = new Parser({ fields })
			const csv = parser.parse(data)
			const csvData = new Blob([csv], { type: 'text/csv' })
			const csvURL = URL.createObjectURL(csvData)
			downloadFile(csvURL)
		},
		[csvFields, data]
	)
	return {
		downloadCSV,
		setCsvFields
	}
}
