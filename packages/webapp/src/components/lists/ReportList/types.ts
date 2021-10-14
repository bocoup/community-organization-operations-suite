/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export enum ReportType {
	SERVICES = 'services',
	CLIENTS = 'clients'
}

export interface IFieldFilter {
	id: string
	name: string
	fieldType: string
	value: string[] | number[] | string | number
}

export interface CsvField {
	label: string
	value: (item: any) => string
}
