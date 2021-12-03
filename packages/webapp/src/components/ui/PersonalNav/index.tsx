/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useWindowSize } from '~hooks/useWindowSize'
import { MobileMenu } from '~ui/MobileMenu'
import { Persona } from '~ui/Persona'
import { FC, memo } from 'react'

export const PersonalNav: FC = memo(function PersonalNav() {
	const { isLG } = useWindowSize()

	return (
		<div className='d-flex align-items-center'>
			<Persona className='me-3 me-lg-0' />

			{!isLG && <MobileMenu />}
		</div>
	)
})
