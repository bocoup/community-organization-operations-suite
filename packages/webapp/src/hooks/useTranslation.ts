/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useTranslation as _useTranslation } from 'next-i18next'

const addInterpolation = options => {
	return options
		? {
				...options,
				interpolation: { prefix: '[[', suffix: ']]' }
		  }
		: undefined
}

export const useTranslation = (namespaces?: string[] | string) => {
	const { t: _c } = _useTranslation('common')
	const { t: _t } = _useTranslation(namespaces || '')

	const t = (key: string, options?: Record<string, any>) => {
		return _t(key, addInterpolation(options))
	}

	const c = (key: string, options?: Record<string, any>) => {
		return _c(key, addInterpolation(options))
	}

	return { t, c }
}
