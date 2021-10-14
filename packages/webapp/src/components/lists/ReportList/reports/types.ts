/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Contact, Service } from '@cbosuite/schema/dist/client-types'
import { IDropdownOption } from '@fluentui/react'
import { CsvField, IFieldFilter } from '../types'

export type FilterHelper = (data: unknown[], filter: IFieldFilter) => unknown[]
export interface CommonReportProps {
	data: unknown[]
	service?: Service
	fieldFilters: IFieldFilter[]
	setFieldFilters: (filters: IFieldFilter[]) => void
	filterColumns: (columnId: string, option: IDropdownOption) => void
	filterColumnTextValue: (key: string, value: string) => void
	filterRangedValues: (key: string, value: string[]) => void
	getDemographicValue: (demographicKey: string, contact: Contact) => string
	setFilterHelper: (arg: { helper: FilterHelper }) => void
	setUnfilteredData: (data: unknown[]) => void
	setFilteredData: (data: unknown[]) => void
	setCsvFields: (fields: Array<CsvField>) => void
}
