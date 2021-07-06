/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { get } from 'lodash'
import locales from '../locales/en-US'

const useTranslation = (key: string) => {
	return get(locales, key)
}

export default useTranslation
