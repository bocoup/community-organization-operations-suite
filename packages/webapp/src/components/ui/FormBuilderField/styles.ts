/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IDropdownStyles, ITextFieldStyles } from '@fluentui/react'

export const fieldNameStyles: Partial<ITextFieldStyles> = {
	field: {
		fontSize: 12,
		'::placeholder': {
			fontSize: 12
		}
	},
	fieldGroup: {
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

export const fieldTypeStyles: Partial<IDropdownStyles> = {
	title: {
		borderRadius: 4,
		borderColor: 'var(--bs-gray-4)'
	},
	dropdown: {
		fontSize: 12,
		':hover': {
			borderColor: 'var(--bs-primary)',
			'.ms-Dropdown-title': {
				borderColor: 'var(--bs-primary)'
			}
		},
		':focus': {
			':after': {
				borderRadius: 4,
				borderWidth: 1
			}
		}
	},
	dropdownItem: {
		fontSize: 12
	},
	dropdownItemSelected: {
		fontSize: 12
	},
	dropdownItemDisabled: {
		fontSize: 12
	},
	dropdownItemSelectedAndDisabled: {
		fontSize: 12
	}
}

export const fieldRequirementStyles: Partial<IDropdownStyles> = {
	title: {
		borderRadius: 4,
		borderColor: 'var(--bs-gray-4)'
	},
	dropdown: {
		fontSize: 12,
		':hover': {
			borderColor: 'var(--bs-primary)',
			'.ms-Dropdown-title': {
				borderColor: 'var(--bs-primary)'
			}
		},
		':focus': {
			':after': {
				borderRadius: 4,
				borderWidth: 1
			}
		}
	},
	dropdownItem: {
		fontSize: 12
	},
	dropdownItemSelected: {
		fontSize: 12
	},
	dropdownItemDisabled: {
		fontSize: 12
	},
	dropdownItemSelectedAndDisabled: {
		fontSize: 12
	}
}
