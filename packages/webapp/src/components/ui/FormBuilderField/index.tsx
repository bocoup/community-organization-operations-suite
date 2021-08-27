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
import { useId } from '@fluentui/react-hooks'

export interface IFormBuilderFieldProps {
	id?: string
	label?: string
	value?: string
	fieldType?: string
	fieldRequirement?: string
}

interface FormBuilderProps extends ComponentProps {
	field?: IFormBuilderFieldProps
	className?: string
	showDeleteButton?: boolean
	showAddButton?: boolean
	onChange?: (id: string, field: IFormBuilderFieldProps) => void
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
	const newId = useId('formbuilder-field')
	const [fieldLabel, setFieldLabel] = useState(field?.label || '')
	const [fieldDataType, setFieldDataType] = useState(field?.fieldType || '')
	const [fieldRequirement, setFieldRequirement] = useState(field?.fieldRequirement || '')

	useEffect(() => {
		setFieldDataType(field?.fieldType || '')
		setFieldLabel(field?.label || '')
		setFieldRequirement(field?.fieldRequirement || '')
		fieldGroup.current = field
	}, [field, fieldGroup])

	if (field.id === 'id_placeholder') {
		fieldGroup.current.id = newId
	}
	const id = fieldGroup.current.id

	const dataTypeOptions = [
		{ key: 'single-text', text: 'Single Text Field' },
		{ key: 'multiline-text', text: 'Multiline Text Field' },
		{ key: 'multi-text', text: 'Multi Text Field', disabled: true },
		{ key: 'number', text: 'Number', disabled: true },
		{ key: 'date', text: 'Date' },
		{ key: 'single-choice', text: 'Single-Choice', disabled: true },
		{ key: 'multi-choice', text: 'Multi-Choice', disabled: true }
	]

	const fieldRequirementOptions = [
		{ key: 'required', text: 'Required' },
		{ key: 'optional', text: 'Optional' },
		{ key: 'client-optional', text: 'Client Optional' }
	]

	const handleFieldChange = () => {
		if (onChange) {
			onChange(id, fieldGroup.current)
		}
	}

	return (
		<Row className={cx(styles.fieldGroupWrapper, className)}>
			<Col>
				<TextField
					name='label'
					placeholder={`Enter field name..`}
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
					placeholder='Select Data Type'
					selectedKey={fieldDataType}
					options={dataTypeOptions}
					onChange={(e, v) => {
						fieldGroup.current.fieldType = v.key as string
						setFieldDataType(v.key as string)
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
			<Col lg={3} className='justify-content-end'>
				<Dropdown
					placeholder='Select Requirement'
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
					<button type='button' onClick={() => onAdd?.()}>
						<Icon iconName='CircleAddition' className={cx(styles.buttonIcon)} />
					</button>
				)}
				{showDeleteButton && (
					<button type='button' onClick={() => onDelete?.()}>
						<Icon iconName='Blocked2' className={cx(styles.buttonIcon)} />
					</button>
				)}
			</Col>
		</Row>
	)
})

export default FormBuilder
