/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Engagement, EngagementStatus } from '@cbosuite/schema/dist/client-types'
import { FC, memo, useMemo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { empty } from '~utils/noop'

export const EngagementStatusText: FC<{
	engagements?: Engagement[]
}> = memo(function EngagementStatusText({ engagements = empty }) {
	const { t } = useTranslation('clients')
	const text = useMemo(() => getEngagementStatusText(engagements, t), [engagements, t])
	return <>{text}</>
})

function getEngagementStatusText(engagements: Engagement[], t: (key: string) => string) {
	let text = ''
	const completeCount = getCompleteEngagementsCount(engagements)
	const openCount = getOpenEngagementsCount(engagements)
	if (completeCount > 0) {
		text += `${completeCount} ${t('clientStatus.completed')}`
	}
	if (openCount > 0) {
		if (completeCount > 0) text += ', '
		text += `${openCount} ${t('clientStatus.open')}`
	}
	if (openCount === 0 && completeCount === 0) {
		text = `0 ${t('clientStatus.requests')}`
	}
	return text
}

function getOpenEngagementsCount(engagements: Engagement[] = []) {
	const openEngagements = engagements.filter((eng) => eng.status !== EngagementStatus.Closed)
	return openEngagements.length
}

function getCompleteEngagementsCount(engagements: Engagement[] = []) {
	const completeEngagements = engagements.filter((eng) => eng.status === EngagementStatus.Closed)
	return completeEngagements.length
}
