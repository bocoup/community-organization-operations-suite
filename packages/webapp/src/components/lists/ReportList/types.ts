/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ServiceFieldType } from '@cbosuite/schema/dist/client-types'

export enum ReportType {
	SERVICES = 'services',
	REQUESTS = 'requests',
	CLIENTS = 'clients'
}

export interface IFieldFilter {
	id: string
	name: string
	type: ServiceFieldType
	value: string[] | number[] | string | number
}

export interface CsvField {
	key?: string
	label: string
	value: (item: any) => string
}
