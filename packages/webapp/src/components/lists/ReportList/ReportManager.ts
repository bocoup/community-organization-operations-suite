/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { empty } from '~utils/noop'
import { IFieldFilter } from './types'

export interface CsvField {
	label: string
	value: (item: any) => string
}

export class ReportManager {
	public isInitialLoad = true
	public unfilteredData: unknown[] = empty
	public filters: IFieldFilter[] = empty
	public csvFields: Array<CsvField> = empty

	public reset() {
		this.unfilteredData = empty
		this.csvFields = empty
		this.filters = empty
	}

	// clientPreload = useRef<{ pageColumns: IPaginatedListColumn[] }>({ pageColumns: [] })
	// servicePreload = useRef<{
	// 	pageColumns: IPaginatedListColumn[]
	// 	service: Service | undefined
	// }>({ pageColumns: [], service: undefined })
}
