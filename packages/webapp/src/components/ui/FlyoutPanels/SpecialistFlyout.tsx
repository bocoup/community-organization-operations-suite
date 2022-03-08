/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FC } from 'react'
import { memo } from 'react'
import { SpecialistPanel } from '~ui/SpecialistPanel'
import { useFlyoutDismisser } from './hooks'
import type { FlyoutProps } from './types'

export const SpecialistFlyout: FC<FlyoutProps & { specialist: string }> = memo(
	function SpecialistFlyout({ isOpen, setIsOpen, specialist }) {
		const handleDismiss = useFlyoutDismisser('specialist', setIsOpen)
		return (
			<SpecialistPanel
				openPanel={isOpen}
				onDismiss={handleDismiss}
				specialistId={specialist ? (specialist as string) : undefined}
			/>
		)
	}
)
