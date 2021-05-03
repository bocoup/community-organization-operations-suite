/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IDetailsRowProps } from '@fluentui/react'

/**
 *
 * @param fieldName {string} fieldName to get the value of from the item
 * @param item {IDetailsRowProps}
 * @returns {string} item field value. returns undefined if the field is not found
 */
export default function getItemFieldValue(
	fieldName: string,
	rowProps: IDetailsRowProps
): string | undefined {
	return (rowProps.item as Record<string, any>)[fieldName] as string
}
