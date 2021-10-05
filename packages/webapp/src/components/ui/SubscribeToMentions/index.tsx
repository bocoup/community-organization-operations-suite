/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { useSubscribeToMentions } from '~hooks/api/useSubscribeToMentions'

export const SubscribeToMentions = memo(function SubscribeToMentions(): JSX.Element {
	useSubscribeToMentions()
	return <></>
})
