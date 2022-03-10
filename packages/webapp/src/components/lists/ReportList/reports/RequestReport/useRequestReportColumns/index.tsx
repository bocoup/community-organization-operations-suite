/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Contact } from '@cbosuite/schema/dist/client-types'
import { useMemo } from 'react'
import { IPaginatedTableColumn } from '~components/ui/PaginatedTable/types'
import { IDropdownOption } from '@fluentui/react'
import { useRequestFieldColumns } from './useRequestFieldColumns'
import { useContactFormColumns } from './useContactFormColumns'

export function useRequestReportColumns(
	filterColumns: (columnId: string, option: IDropdownOption) => void,
	filterColumnTextValue: (key: string, value: string) => void,
	filterRangedValues: (key: string, value: string[]) => void,
	getDemographicValue: (demographicKey: string, contact: Contact) => string,
	hiddenFields: Record<string, boolean>
) {
	const contactFormColumns = useContactFormColumns(
		filterColumns,
		filterColumnTextValue,
		filterRangedValues,
		getDemographicValue,
		hiddenFields
	)
	const requestFieldColumns = useRequestFieldColumns(
		filterColumns,
		filterColumnTextValue,
		filterRangedValues,
		hiddenFields
	)

	return useMemo<IPaginatedTableColumn[]>(
		() => [...contactFormColumns, ...requestFieldColumns],
		[contactFormColumns, requestFieldColumns]
	)
}
