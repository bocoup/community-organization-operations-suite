/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FontIcon } from '@fluentui/react'

export default function MobileMenu(): JSX.Element {
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
