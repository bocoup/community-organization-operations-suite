/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CSSProperties } from 'react'
/**
 * Default props for components
 * TODO: extend HTMLProps and the html tag to inherit from
 */
export default interface ComponentProps {
	children?: JSX.Element | JSX.Element[]
	className?: string
	key?: string | number
	style?: CSSProperties
}
