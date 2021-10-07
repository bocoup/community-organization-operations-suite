/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IDetailsRowProps } from '@fluentui/react'

/**
 *
 * @param fieldName {string} fieldName to get the header of from the deatilsRowProps
 * @param item {IDetailsRowProps}
 * @returns Column header as a string
 */
export function getItemHeader(fieldName: string, rowProps: IDetailsRowProps): string {
	return rowProps.columns.find((c) => c.fieldName === fieldName)?.name
}
