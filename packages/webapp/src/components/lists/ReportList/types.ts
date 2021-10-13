/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export enum ReportTypes {
	SERVICES = 'services',
	CLIENTS = 'clients'
}

export interface IFieldFilter {
	id: string
	name: string
	fieldType: string
	value: string[]
}
