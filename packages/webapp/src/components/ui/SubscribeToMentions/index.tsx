/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FC, memo } from 'react'
import { useSubscribeToMentions } from '~hooks/api/useSubscribeToMentions'

export const SubscribeToMentions: FC = memo(function SubscribeToMentions() {
	useSubscribeToMentions()
	return <></>
})
