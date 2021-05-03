/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FontIcon } from '@fluentui/react'
import type ComponentProps from '~types/ComponentProps'

interface MobileMenuProps extends ComponentProps {
	title?: string
}

export default function MobileMenu({}: MobileMenuProps): JSX.Element {
	return (
		<>
			<FontIcon
				className='text-light'
				iconName='GlobalNavButton'
				onClick={() => console.log('menu clicked')}
			/>
		</>
	)
}
