/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDetailsRowProps } from '@fluentui/react'
import { get } from 'lodash'

/**
 *
 * @param fieldName {string} fieldName to get the header of from the deatilsRowProps
 * @param item {IDetailsRowProps}
 * @returns Body as JSX or gets the item field based on fieldName
 */
export function getItemBody(body: string, rowProps: IDetailsRowProps): string | undefined {
	return get(rowProps, `item[${body}]`) as string | undefined
}
