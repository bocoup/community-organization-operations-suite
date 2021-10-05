/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CSSProperties, ReactNode, ReactNodeArray } from 'react'

export interface StandardComponentProps {
	className?: string
	id?: string
	style?: CSSProperties
	onClick?: (args: any) => void
	children?: ReactNode | ReactNodeArray
}

export type StandardFC<Props = Record<string, unknown>> = React.FC<Props & StandardComponentProps>
