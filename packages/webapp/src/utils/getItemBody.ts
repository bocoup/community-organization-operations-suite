/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IDetailsRowProps } from '@fluentui/react'
import { get } from 'lodash'

type getItemBodyType = (body: string, rowProps: IDetailsRowProps) => string | undefined
/**
 *
 * @param fieldName {string} fieldName to get the header of from the deatilsRowProps
 * @param item {IDetailsRowProps}
 * @returns Body as JSX or gets the item field based on fieldName
 */
const getItemBody: getItemBodyType = (body, rowProps) => {
	// if (isValidElement(body)) return body
	// TODO: PLEASE THE TS GODS
	/* eslint-disable @typescript-eslint/no-unsafe-call */
	return get(rowProps, `item[${body}]`) as string | undefined
}

export default getItemBody
