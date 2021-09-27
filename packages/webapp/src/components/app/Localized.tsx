/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FC, memo } from 'react'
import { IntlProvider } from 'react-intl'
import { useLocale } from '~hooks/useLocale'

export const Localized: FC = memo(function Localized({ children }) {
	const [localeValue] = useLocale()
	return <IntlProvider locale={localeValue}>{children}</IntlProvider>
})
