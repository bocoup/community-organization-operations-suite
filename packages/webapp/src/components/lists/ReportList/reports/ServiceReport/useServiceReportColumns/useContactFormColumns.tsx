/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Contact } from '@cbosuite/schema/dist/client-types'
import { useMemo } from 'react'
import type { IDropdownOption } from '@fluentui/react'
import { useContactFormColumns as useContactFormColumnsHelper } from '../../RequestReport/useRequestReportColumns/useContactFormColumns'

export function useContactFormColumns(
	enabled: boolean,
	filterColumns: (columnId: string, option: IDropdownOption) => void,
	filterColumnTextValue: (key: string, value: string) => void,
	filterRangedValues: (key: string, value: string[]) => void,
	getDemographicValue: (demographicKey: string, contact: Contact) => string,
	hiddenFields: Record<string, boolean>,
	onTrackEvent?: (name?: string) => void
) {
	const columns = useContactFormColumnsHelper(
		filterColumns,
		filterColumnTextValue,
		filterRangedValues,
		getDemographicValue,
		hiddenFields,
		onTrackEvent
	)

	return useMemo(() => {
		return enabled ? columns : []
	}, [enabled, columns])
}
