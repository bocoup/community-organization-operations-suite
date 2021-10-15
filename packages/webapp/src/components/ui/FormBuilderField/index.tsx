/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useRef, useEffect, useState } from 'react'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { Col, Row } from 'react-bootstrap'
import cx from 'classnames'
import { Icon } from '~ui/Icon'
import { TextField, Dropdown } from '@fluentui/react'
import { useTranslation } from '~hooks/useTranslation'
import { FormBuilderOptionField } from '../FormBuilderOptionField'
import { useBoolean } from '@fluentui/react-hooks'
import { useFieldGroupValidator, useFieldRequirementOptions, useFieldTypeOptions } from './hooks'
import { fieldNameStyles, fieldTypeStyles, fieldRequirementStyles } from './styles'
import { noop } from '~utils/noop'
import { ServiceFieldRequirement, ServiceFieldType } from '@cbosuite/schema/dist/client-types'
import { hasOptionFields } from '~utils/forms'

export interface IFormBuilderFieldValueProps {
	id: string
	label: string
}

export interface IFormBuilderFieldProps {
	id?: string
	label?: string
	inputs?: IFormBuilderFieldValueProps[]
	type: ServiceFieldType
	requirement?: ServiceFieldRequirement
	disableField?: boolean
}

interface FormBuilderProps {
	field?: IFormBuilderFieldProps
	className?: string
	showDeleteButton?: boolean
	showAddButton?: boolean
	isFieldGroupValid?: (isValid: boolean) => void
	onChange?: (field: IFormBuilderFieldProps) => void
	onDelete?: () => void
	onAdd?: () => void
}

export const FormBuilderField: StandardFC<FormBuilderProps> = memo(function FormBuilderField({
	id,
	field,
	className,
	showDeleteButton = true,
	showAddButton = true,
	isFieldGroupValid = noop,
	onChange = noop,
	onDelete = noop,
	onAdd = noop
}) {
	// Generally stable options
	const { t } = useTranslation('services')
	const fieldTypeOptions = useFieldTypeOptions()
	const fieldRequirementOptions = useFieldRequirementOptions()

	// Field Data Output
	const fieldGroup = useRef<IFormBuilderFieldProps>(field)

	// Field Content
	const [fieldLabel, setFieldLabel] = useState(field?.label || '')
	const [fieldDataType, setFieldDataType] = useState<ServiceFieldType>(
		field?.type || ServiceFieldType.SingleText
	)
	const [fieldRequirement, setFieldRequirement] = useState<ServiceFieldRequirement>(
		field?.requirement || ServiceFieldRequirement.Optional
	)
	const [fieldOptions, setFieldOptions] = useState(field?.inputs || [])
	const [isOptionFieldsVisible, { setTrue: showOptionFields, setFalse: hideOptionFields }] =
		useBoolean(hasOptionFields(fieldDataType))

	// Field Validation
	const errorMessage = useRef('')
	const validateFieldGroup = useFieldGroupValidator(errorMessage, isFieldGroupValid)
	const [hasErrors, setHasErrors] = useState(!validateFieldGroup(field))

	useEffect(() => {
		setFieldDataType(field?.type || ServiceFieldType.SingleText)
		setFieldLabel(field?.label || '')
		setFieldRequirement(field?.requirement || ServiceFieldRequirement.Optional)
		fieldGroup.current = field

		if (hasOptionFields(field?.type || ServiceFieldType.SingleText)) {
			const newOptions = field?.inputs.length > 0 ? [...field?.inputs] : [{ id: '', label: '' }]
			setFieldOptions(newOptions)
			showOptionFields()
		} else {
			setFieldOptions([])
			fieldGroup.current.inputs = []
			hideOptionFields()
		}

		setHasErrors(!validateFieldGroup(fieldGroup.current))
	}, [field, fieldGroup, showOptionFields, hideOptionFields, validateFieldGroup])

	function handleFieldChange() {
		setHasErrors(!validateFieldGroup(fieldGroup.current))
		onChange(fieldGroup.current)
	}

	function handleDataTypeChange(key: ServiceFieldType) {
		setFieldDataType(key)

		if (hasOptionFields(key)) {
			const newOptions = fieldOptions.length > 0 ? [...fieldOptions] : [{ id: '', label: '' }]
			setFieldOptions(newOptions)
			showOptionFields()
		} else {
			setFieldOptions([])
			hideOptionFields()
			fieldGroup.current.inputs = []
		}

		fieldGroup.current.type = key
		handleFieldChange()
	}

	function handleAddOption(index) {
		const newFieldOptions = [...fieldOptions]
		if (index === fieldOptions.length - 1) {
			newFieldOptions.push({ id: '', label: '' })
		} else {
			newFieldOptions.splice(index + 1, 0, { id: '', label: '' })
		}
		setFieldOptions(newFieldOptions)
		fieldGroup.current.inputs = newFieldOptions
		setHasErrors(!validateFieldGroup(fieldGroup.current))
	}

	function handleDeleteOption(index) {
		const newFieldOptions = [...fieldOptions]
		newFieldOptions.splice(index, 1)
		setFieldOptions(newFieldOptions)
		fieldGroup.current.inputs = newFieldOptions
		setHasErrors(!validateFieldGroup(fieldGroup.current))
	}

	return (
		<>
			<Row id={id} className={cx(styles.fieldGroupWrapper, className)}>
				<Col>
					<TextField
						name='label'
						placeholder={t('formBuilder.placeholders.fieldName')}
						value={fieldLabel}
						onChange={(e, v) => {
							fieldGroup.current.label = v
							setFieldLabel(v)
							handleFieldChange()
						}}
						className='fieldLabel mb-3 mb-lg-0'
						styles={fieldNameStyles}
					/>
				</Col>
				<Col lg={3} className='justify-content-end'>
					<Dropdown
						placeholder={t('formBuilder.placeholders.fieldType')}
						selectedKey={fieldDataType}
						options={fieldTypeOptions}
						disabled={field?.disableField}
						onChange={(e, v) => {
							handleDataTypeChange(v.key as ServiceFieldType)
						}}
						className='mb-3 mb-lg-0'
						styles={fieldTypeStyles}
					/>
				</Col>
				<Col lg={2} className='justify-content-end'>
					<Dropdown
						placeholder={t('formBuilder.placeholders.fieldRequirement')}
						selectedKey={fieldRequirement}
						options={fieldRequirementOptions}
						onChange={(e, v) => {
							fieldGroup.current.requirement = v.key as ServiceFieldRequirement
							setFieldRequirement(v.key as ServiceFieldRequirement)
							handleFieldChange()
						}}
						className='requirementDropdown mb-3 mb-lg-0'
						styles={fieldRequirementStyles}
					/>
				</Col>
				<Col lg={1} className={cx(styles.actionButtons)}>
					{showAddButton && (
						<button type='button' aria-label={t('formBuilder.buttons.addField')} onClick={onAdd}>
							<Icon iconName='CircleAdditionSolid' className={cx(styles.addIcon)} />
						</button>
					)}
					{showDeleteButton && (
						<button
							type='button'
							aria-label={t('formBuilder.buttons.removeField')}
							onClick={onDelete}
						>
							<Icon iconName='Blocked2Solid' className={cx(styles.removeIcon)} />
						</button>
					)}
				</Col>
			</Row>
			{isOptionFieldsVisible && (
				<FormBuilderOptionField
					options={fieldOptions}
					showDeleteButton={fieldOptions.length > 1}
					onAdd={(index) => handleAddOption(index)}
					onDelete={(index) => handleDeleteOption(index)}
					onChange={(options) => {
						fieldGroup.current.inputs = options
						setFieldOptions(options)
						setHasErrors(!validateFieldGroup(fieldGroup.current))
					}}
				/>
			)}
			{hasErrors && <div className={styles.rowError}>{errorMessage.current}</div>}
		</>
	)
})
