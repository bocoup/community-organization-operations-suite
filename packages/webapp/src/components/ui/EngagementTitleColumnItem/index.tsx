/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Engagement } from '@cbosuite/schema/dist/client-types'
import { FC, memo } from 'react'
import { CardRowTitle } from '~components/ui/CardRowTitle'
import { useNavCallback } from '~hooks/useNavCallback'

export const EngagementTitleColumnItem: FC<{ engagement: Engagement }> = memo(
	function EngagementTitleColumnItem({ engagement }) {
		const handleClick = useNavCallback(null, { engagement: engagement.id })
		return <CardRowTitle tag='span' title={engagement.title} titleLink='/' onClick={handleClick} />
	}
)
