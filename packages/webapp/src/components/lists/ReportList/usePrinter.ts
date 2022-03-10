/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import printJS from 'print-js'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { ReportType } from './types'
import { trackEvent } from '~utils/appinsights'
import { useCurrentUser } from '~hooks/api/useCurrentUser'

export function usePrinter() {
	const { t } = useTranslation(
		Namespace.Reporting,
		Namespace.Clients,
		Namespace.Requests,
		Namespace.Services
	)
	const { orgId } = useCurrentUser()

	const print = useCallback(
		function print(
			printableJsonData: Array<any>,
			printableFields: Array<string>,
			reportType: ReportType,
			areFiltersApplied?: boolean
		) {
			let reportTypeTranslation = ''
			if (reportType === ReportType.CLIENTS) {
				reportTypeTranslation = t('requestListColumns.clients')
			} else if (reportType === ReportType.SERVICES) {
				reportTypeTranslation = t('servicesTitle')
			} else if (reportType === ReportType.REQUESTS) {
				reportTypeTranslation = t('requestsTitle')
			}

			trackEvent({
				name: 'Export Data',
				properties: {
					'Organization ID': orgId,
					'Export Format': 'print',
					'Data Category': reportType,
					'Row Count': printableJsonData.length,
					'Filters Applied': areFiltersApplied
				}
			})

			printJS({
				printable: printableJsonData,
				type: 'json',
				properties: printableFields,
				style:
					'.header { font-size: 2em; font-weight: bold; } .date { color: #ccc; } .header-container { display: flex; justify-content: space-between; } body { font-size: 0.5em; font-family: "Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif; } @page { size: landscape; }',
				header: `<div class="header-container"><div class="header">${reportTypeTranslation}</div> <div class="date">${new Date().toLocaleString()}</div></div> <h2>${
					printableJsonData.length
				} ${t('printHeaderItems')}<h2>`,
				headerStyle: 'font-size: 1.5em;',
				gridHeaderStyle:
					'font-weight: bold; border-bottom: 2px solid #000; border-right: 1px solid #CCC;',
				gridStyle: 'border: 1px solid #CCC; border-left: none;'
			})
		},
		[t]
	)

	return {
		print
	}
}
