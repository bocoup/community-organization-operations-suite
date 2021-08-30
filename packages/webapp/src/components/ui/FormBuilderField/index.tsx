/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useRef, useEffect, useState } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { Col, Row } from 'react-bootstrap'
import cx from 'classnames'
import Icon from '~ui/Icon'
import { TextField, Dropdown } from '@fluentui/react'
import { useTranslation } from '~hooks/useTranslation'
import FormBuilderOptionField from '../FormBuilderOptionField'
import { useBoolean } from '@fluentui/react-hooks'

export interface IFormBuilderFieldProps {
	label?: string
	value?: string[]
	fieldType?: string
	fieldRequirement?: string
}

interface FormBuilderProps extends ComponentProps {
	field?: IFormBuilderFieldProps
	className?: string
	showDeleteButton?: boolean
	showAddButton?: boolean
	onChange?: (field: IFormBuilderFieldProps) => void
	onDelete?: () => void
	onAdd?: () => void
}

const FormBuilder = memo(function FormBuilder({
	field,
	className,
	showDeleteButton = true,
	showAddButton = true,
	onChange,
	onDelete,
	onAdd
}: FormBuilderProps): JSX.Element {
	const fieldGroup = useRef<IFormBuilderFieldProps>(field)
	const { t } = useTranslation('services')
	const [fieldLabel, setFieldLabel] = useState(field?.label || '')
	const [fieldDataType, setFieldDataType] = useState(field?.fieldType || '')
	const [fieldRequirement, setFieldRequirement] = useState(field?.fieldRequirement || '')
	const [fieldOptions, setFieldOptions] = useState(field?.value || [])

	const showOptions =
		fieldGroup.current.fieldType === 'single-choice' ||
		fieldGroup.current.fieldType === 'multi-choice'

	const [isOptionFieldsVisible, { setTrue: showOptionFields, setFalse: hideOptionFields }] =
		useBoolean(showOptions)

	useEffect(() => {
		setFieldDataType(field?.fieldType || '')
		setFieldLabel(field?.label || '')
		setFieldRequirement(field?.fieldRequirement || '')
		setFieldOptions(field?.value || [])
		fieldGroup.current = field
	}, [field, fieldGroup])

	const dataTypeOptions = [
		{ key: 'single-text', text: t('formBuilder.dataTypeOptions.singleText') },
		{ key: 'multiline-text', text: t('formBuilder.dataTypeOptions.multilineText') },
		{
			key: 'multi-text',
			text: t('formBuilder.dataTypeOptions.multiText'),
			disabled: true
		},
		{ key: 'number', text: t('formBuilder.dataTypeOptions.number'), disabled: true },
		{ key: 'date', text: t('formBuilder.dataTypeOptions.date') },
		{
			key: 'single-choice',
			text: t('formBuilder.dataTypeOptions.singleChoice')
		},
		{
			key: 'multi-choice',
			text: t('formBuilder.dataTypeOptions.multiChoice')
		}
	]

	const fieldRequirementOptions = [
		{ key: 'required', text: t('formBuilder.fieldRequirementOptions.required') },
		{ key: 'optional', text: t('formBuilder.fieldRequirementOptions.optional') },
		{
			key: 'client-optional',
			text: t('formBuilder.fieldRequirementOptions.clientOptional')
		}
	]

	const handleFieldChange = () => {
		if (onChange) {
			onChange(fieldGroup.current)
		}
	}

	const handleDataTypeChange = (key: string) => {
		setFieldDataType(key)

		if (key === 'single-choice' || key === 'multi-choice') {
			const newOptions = fieldOptions.length > 0 ? [...fieldOptions] : ['']
			setFieldOptions(newOptions)
			showOptionFields()
		} else {
			setFieldOptions([])
			hideOptionFields()
			fieldGroup.current.value = []
		}

		handleFieldChange()
	}

	const handleAddOption = (index) => {
		const newFieldOptions = [...fieldOptions]
		if (index === fieldOptions.length - 1) {
			newFieldOptions.push('')
		} else {
			newFieldOptions.splice(index + 1, 0, '')
		}
		setFieldOptions(newFieldOptions)
	}

	const handleDeleteOption = (index) => {
		const newFieldOptions = [...fieldOptions]
		newFieldOptions.splice(index, 1)
		setFieldOptions(newFieldOptions)
	}

	return (
		<>
			<Row className={cx(styles.fieldGroupWrapper, className)}>
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
						className='mb-3 mb-lg-0'
						styles={{
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
						}}
					/>
				</Col>
				<Col lg={3} className='justify-content-end'>
					<Dropdown
						placeholder={t('formBuilder.placeholders.fieldType')}
						selectedKey={fieldDataType}
						options={dataTypeOptions}
						onChange={(e, v) => {
							handleDataTypeChange(v.key as string)
						}}
						className='mb-3 mb-lg-0'
						styles={{
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
						}}
					/>
				</Col>
				<Col lg={3} className='justify-content-end'>
					<Dropdown
						placeholder={t('formBuilder.placeholders.fieldRequirement')}
						selectedKey={fieldRequirement}
						options={fieldRequirementOptions}
						onChange={(e, v) => {
							fieldGroup.current.fieldRequirement = v.key as string
							setFieldRequirement(v.key as string)
							handleFieldChange()
						}}
						className='mb-3 mb-lg-0'
						styles={{
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
						}}
					/>
				</Col>
				<Col lg={1} className={cx(styles.actionButtons)}>
					{showAddButton && (
						<button
							type='button'
							aria-label={t('formBuilder.buttons.addField')}
							onClick={() => onAdd?.()}
						>
							<Icon iconName='CircleAdditionSolid' className={cx(styles.addIcon)} />
						</button>
					)}
					{showDeleteButton && (
						<button
							type='button'
							aria-label={t('formBuilder.buttons.removeField')}
							onClick={() => onDelete?.()}
						>
							<Icon iconName='Blocked2Solid' className={cx(styles.removeIcon)} />
						</button>
					)}
				</Col>
			</Row>
			{isOptionFieldsVisible && (
				<FormBuilderOptionField
					options={fieldOptions}
					onAdd={(index) => handleAddOption(index)}
					onDelete={(index) => handleDeleteOption(index)}
					onChange={(options) => (fieldGroup.current.value = options)}
				/>
			)}
		</>
	)
})

export default FormBuilder
