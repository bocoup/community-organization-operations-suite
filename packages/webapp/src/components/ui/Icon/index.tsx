/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FontIcon, IFontIconProps } from '@fluentui/react'
import ClientOnly from '~ui/ClientOnly'

// Render FonIcon on client only to prevent ssr issues
export default function Icon(props: IFontIconProps): JSX.Element {
	return (
		<ClientOnly>
			<FontIcon {...props} />
		</ClientOnly>
	)
}
