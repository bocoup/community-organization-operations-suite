/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FontIcon, IFontIconProps } from '@fluentui/react'
import { memo } from 'react'

// Render FonIcon on client only to prevent ssr issues
export const Icon = memo(function Icon(props: IFontIconProps): JSX.Element {
	return <FontIcon {...props} />
})
