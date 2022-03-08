/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	IDatePickerStyles,
	ITextFieldStyles,
	IChoiceGroupStyles,
	ICheckboxStyles
} from '@fluentui/react'

export const fieldStyles: {
	textField: Partial<ITextFieldStyles>
	choiceGroup: Partial<IChoiceGroupStyles>
	checkbox: Partial<ICheckboxStyles>
	datePicker: Partial<IDatePickerStyles>
} = {
	textField: {
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
		},
		wrapper: {
			selectors: {
				'.ms-Label': {
					':after': {
						color: 'var(--bs-danger)'
					}
				}
			}
		}
	},
	choiceGroup: {
		root: {
			selectors: {
				'.ms-ChoiceField-field': {
					':before': {
						borderColor: 'var(--bs-gray-4)'
					}
				}
			}
		},
		label: {
			':after': {
				color: 'var(--bs-danger)'
			}
		}
	},
	checkbox: {
		checkbox: {
			borderColor: 'var(--bs-gray-4)'
		}
	},
	datePicker: {
		root: {
			border: 0
		},
		wrapper: {
			border: 0
		},
		textField: {
			selectors: {
				'.ms-TextField-fieldGroup': {
					borderRadius: 4,
					height: 34,
					borderColor: 'var(--bs-gray-4)',
					':after': {
						outline: 0,
						border: 0
					},
					':hover': {
						borderColor: 'var(--bs-primary)'
					}
				},
				'.ms-Label': {
					':after': {
						color: 'var(--bs-danger)'
					}
				}
			}
		}
	}
}
