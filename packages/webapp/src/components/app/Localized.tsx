/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable no-restricted-globals */
import { FC, memo } from 'react'
import { IntlProvider } from 'react-intl'
import { useLocale } from '~hooks/useLocale'

export const Localized: FC = memo(function Localized({ children }) {
	const [localeValue] = useLocale()
	return <IntlProvider locale={localeValue}>{children}</IntlProvider>
})
