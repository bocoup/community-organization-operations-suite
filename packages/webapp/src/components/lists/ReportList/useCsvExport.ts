/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useState } from 'react'
import { empty } from '~utils/noop'
import type { CsvField } from './types'
import { Parser } from 'json2csv/dist/json2csv.umd'
import { downloadFile } from '~utils/downloadFile'
import { trackEvent } from '~utils/appinsights'
import { useCurrentUser } from '~hooks/api/useCurrentUser'

export function useCsvExport(data: unknown[]) {
	const [csvFields, setCsvFields] = useState<CsvField[]>(empty)
	const { orgId } = useCurrentUser()

	const downloadCSV = useCallback(
		function downloadCSV(reportType?: string, areFiltersApplied?: boolean) {
			const fields = csvFields
			const parser = new Parser({ fields })
			const csv = parser.parse(data)
			const csvData = new Blob([csv], { type: 'text/csv' })
			const csvURL = URL.createObjectURL(csvData)

			trackEvent({
				name: 'Export Data',
				properties: {
					'Organization ID': orgId,
					'Export Format': 'csv',
					'Data Category': reportType,
					'Row Count': data.length,
					'Filters Applied': areFiltersApplied
				}
			})

			downloadFile(csvURL)
		},
		[csvFields, data, orgId]
	)
	return {
		downloadCSV,
		setCsvFields,
		csvFields
	}
}
