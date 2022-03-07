/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Contact, Service, ServiceAnswer } from '@cbosuite/schema/dist/client-types'
import { useMemo } from 'react'
import type { IPaginatedTableColumn } from '~components/ui/PaginatedTable/types'
import type { IDropdownOption } from '@fluentui/react'
import { empty } from '~utils/noop'
import { useActionColumns } from './useActionColumns'
import { useServiceFieldColumns } from './useServiceFieldColumns'
import { useContactFormColumns } from './useContactFormColumns'

export function useServiceReportColumns(
	service: Service,
	data: unknown[],
	filterColumns: (columnId: string, option: IDropdownOption) => void,
	filterColumnTextValue: (key: string, value: string) => void,
	filterRangedValues: (key: string, value: string[]) => void,
	getDemographicValue: (demographicKey: string, contact: Contact) => string,
	handleEdit: (record: ServiceAnswer) => void,
	handleDelete: (record: ServiceAnswer) => void,
	hiddenFields: Record<string, boolean>
) {
	const contactFormColumns = useContactFormColumns(
		service.contactFormEnabled,
		filterColumns,
		filterColumnTextValue,
		filterRangedValues,
		getDemographicValue,
		hiddenFields
	)
	const serviceFieldColumns = useServiceFieldColumns(
		data,
		service.fields ?? empty,
		filterColumns,
		filterColumnTextValue,
		filterRangedValues,
		hiddenFields
	)
	const actionColumns = useActionColumns(handleEdit, handleDelete)

	return useMemo<IPaginatedTableColumn[]>(
		() => [...contactFormColumns, ...serviceFieldColumns, ...actionColumns],
		[contactFormColumns, serviceFieldColumns, actionColumns]
	)
}
