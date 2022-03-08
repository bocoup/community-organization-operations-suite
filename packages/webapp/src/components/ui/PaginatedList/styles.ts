/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IIconProps, ITextFieldStyles } from '@fluentui/react'

export const searchFieldStyles: Partial<ITextFieldStyles> = {
	field: {
		fontSize: 12,
		paddingRight: 30,
		':after': {
			paddingRight: 30
		},
		'::placeholder': {
			fontSize: 14,
			color: 'var(--bs-text-muted)'
		}
	},
	fieldGroup: {
		height: 36,
		borderColor: 'var(--bs-gray-4)',
		borderRadius: 4,
		':hover': {
			borderColor: 'var(--bs-primary)'
		},
		':after': {
			borderRadius: 4,
			borderWidth: 1
		}
	}
}

export const searchFieldIconProps: IIconProps = {
	iconName: 'Search',
	styles: {
		root: {
			bottom: 8,
			color: 'var(--bs-text-muted)'
		}
	}
}
