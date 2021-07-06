/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

/**
 * Handles adding translations to page at build time
 *
 * @param namespaces
 * @returns
 */
const getServerSideTranslations = (namespaces: string[] = []) => {
	return async ({ locale }) => {
		if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
			localStorage.setItem('locale', locale)
		}

		const _namespaces = namespaces.concat(['common', 'footer'])

		return {
			props: {
				...(await serverSideTranslations(locale, _namespaces))
			}
		}
	}
}

export default getServerSideTranslations
