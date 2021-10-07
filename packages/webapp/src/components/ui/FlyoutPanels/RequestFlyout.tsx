/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RequestPanel } from '~ui/RequestPanel'
import { FC, memo } from 'react'
import { useOrganization } from '~hooks/api/useOrganization'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useFlyoutDismisser } from './hooks'
import { FlyoutProps } from './types'

export const RequestFlyout: FC<FlyoutProps & { engagement: string }> = memo(function RequestFlyout({
	isOpen,
	setIsOpen,
	engagement
}) {
	const handleDismiss = useFlyoutDismisser('engagement', setIsOpen)
	const { orgId } = useCurrentUser()
	const { organization } = useOrganization(orgId)
	return (
		<RequestPanel
			openPanel={isOpen}
			onDismiss={handleDismiss}
			request={engagement ? { id: engagement as string, orgId: organization?.id } : undefined}
		/>
	)
})
