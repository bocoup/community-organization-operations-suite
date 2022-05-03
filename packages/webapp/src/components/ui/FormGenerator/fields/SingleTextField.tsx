/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ServiceField } from '@cbosuite/schema/dist/client-types'
import { ServiceFieldRequirement } from '@cbosuite/schema/dist/client-types'
import { TextField } from '@fluentui/react'
import type { FC, FocusEvent } from 'react'
import React, { memo, useCallback } from 'react'
import type { FormFieldManager } from '../FormFieldManager'
import { useInitialFieldValue } from '../FormFieldManager'
import { fieldStyles } from './styles'

export const SingleTextField: FC<{
	editMode: boolean
	mgr: FormFieldManager
	field: ServiceField
	onChange: (submitEnabled: boolean) => void
}> = memo(function SingleTextField({ editMode, mgr, field, onChange }) {
	const initialValue = useInitialFieldValue(field, mgr, editMode)
	const handleChange = useCallback(
		(value: string) => {
			mgr.clearFieldError(field.id)
			mgr.saveFieldSingleValue(field, value)
			onChange(mgr.isSubmitEnabled())
		},
		[field, mgr, onChange]
	)

	return (
		<TextField
			label={field.name}
			required={field.requirement === ServiceFieldRequirement.Required}
			defaultValue={initialValue}
			onBlur={(e: FocusEvent<HTMLInputElement>) => handleChange(e.target.value)}
			onChange={(e, value) => handleChange(value)}
			styles={fieldStyles.textField}
			placeholder={mgr.getfieldPlaceholderText(field.type)}
			onGetErrorMessage={() => (mgr.hasErrorInField(field.id) ? mgr.getErrorMessage(field.id) : '')}
		/>
	)
})
