/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CSSProperties, ReactNode, ReactNodeArray } from 'react'
/**
 * Default props for components
 * TODO: extend HTMLProps and the html tag to inherit from
 */
export interface ComponentProps {
	children?: ReactNode | ReactNodeArray
	className?: string
	key?: string | number
	style?: CSSProperties
	onClick?: (args: any) => void
}

export type StandardFC<Props> = React.FC<
	Props & {
		className?: string
		id?: string
		key?: string | number
		style?: CSSProperties
		onClick?: (args: any) => void
	}
>
