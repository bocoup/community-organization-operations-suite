/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { FC, memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'

export const RaceText: FC<{ race?: string }> = memo(function RaceText({ race }) {
	const { t } = useTranslation('clients')
	if (race && race !== '') {
		return <span>{t(`demographics.race.options.${race}`)}</span>
	}
	return <span className='text-muted'>{t('demographics.notProvided')}</span>
})
