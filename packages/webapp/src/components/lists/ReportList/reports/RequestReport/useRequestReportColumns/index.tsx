/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Contact } from '@cbosuite/schema/dist/client-types'
import { useMemo } from 'react'
import type { IPaginatedTableColumn } from '~components/ui/PaginatedTable/types'
import { useRequestFieldColumns } from './useRequestFieldColumns'
import { useContactFormColumns } from './useContactFormColumns'

export function useRequestReportColumns(
	filterColumns: (columnId: string, value: string[]) => void,
	filterColumnTextValue: (key: string, value: string) => void,
	filterRangedValues: (key: string, value: string[]) => void,
	getDemographicValue: (demographicKey: string, contact: Contact) => string,
	hiddenFields: Record<string, boolean>,
	onTrackEvent?: (name?: string) => void
) {
	const contactFormColumns = useContactFormColumns(
		filterColumns,
		filterColumnTextValue,
		filterRangedValues,
		getDemographicValue,
		hiddenFields,
		onTrackEvent
	)
	const requestFieldColumns = useRequestFieldColumns(
		filterColumns,
		filterColumnTextValue,
		filterRangedValues,
		hiddenFields,
		onTrackEvent
	)

	return useMemo<IPaginatedTableColumn[]>(
		() => [...contactFormColumns, ...requestFieldColumns],
		[contactFormColumns, requestFieldColumns]
	)
}
