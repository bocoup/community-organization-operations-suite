/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { User } from '@cbosuite/schema/dist/client-types'
import { FC, memo } from 'react'
import { useNavCallback } from '~hooks/useNavCallback'
import { CardRowTitle } from '../CardRowTitle'

export const SpecialistTitleColumnItem: FC<{ user: User }> = memo(
	function SpecialistTitleColumnItem({ user }) {
		const handleClick = useNavCallback(null, { specialist: user.id })
		return (
			<CardRowTitle
				tag='span'
				title={`${user.name.first} ${user.name.last}`}
				titleLink='/'
				onClick={handleClick}
			/>
		)
	}
)
