/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { FC, memo } from 'react'
import { Namespace, useTranslation } from '~hooks/useTranslation'

export const GenderText: FC<{ gender?: string }> = memo(function GenderText({ gender }) {
	const { t } = useTranslation(Namespace.Clients)
	if (gender && gender !== '') {
		return <span>{t(`demographics.gender.options.${gender}`)}</span>
	}
	return <span className='text-muted'>{t('demographics.notProvided')}</span>
})
