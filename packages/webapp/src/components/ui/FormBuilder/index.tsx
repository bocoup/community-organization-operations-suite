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
	id: string
	label?: string
	value?: string
	fieldType?: string
	fieldRequirement?: string
}

interface FormBuilderProps extends ComponentProps {
	field?: IFormBuilderFieldProps
	className?: string
	showLabels?: boolean
	showDeleteButton?: boolean
	onChange?: (id: string, field: IFormBuilderFieldProps) => void
	onDelete?: () => void
}

const FormBuilder = function FormBuilder({
	field,
	className,
	showLabels = false,
	showDeleteButton = true,
	onChange,
	onDelete
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
		{ key: 'multi-text', text: 'Multi Text Field' },
		{ key: 'number', text: 'Number' },
		{ key: 'date', text: 'Date' },
		{ key: 'single-choice', text: 'Single-Choice' },
		{ key: 'multi-choice', text: 'Multi-Choice' }
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
		<Col className={cx(styles.fieldGroupWrapper, className)}>
			<Row>
				<Col>
					<TextField
						name='label'
						label={showLabels ? 'Form Fields' : undefined}
						placeholder={`Enter field name..${id}`}
						value={fieldLabel}
						onChange={(e, v) => {
							fieldGroup.current.label = v
							setFieldLabel(v)
							handleFieldChange()
						}}
						styles={{
							field: {
								fontSize: 12,
								'::placeholder': {
									fontSize: 12
								}
							},
							fieldGroup: {
								borderRadius: 4,
								':after': {
									borderRadius: 4
								}
							}
						}}
					/>
				</Col>
				<Col md={3} className='justify-content-end'>
					<Dropdown
						label={showLabels ? 'Data Type' : undefined}
						placeholder='Select option'
						selectedKey={fieldDataType}
						options={dataTypeOptions}
						onChange={(e, v) => {
							fieldGroup.current.fieldType = v.key as string
							setFieldDataType(v.key as string)
							handleFieldChange()
						}}
						styles={{
							title: {
								borderRadius: 4
							},
							dropdown: {
								fontSize: 12
							},
							dropdownItem: {
								fontSize: 12
							},
							dropdownItemSelected: {
								fontSize: 12
							},
							dropdownItemSelectedAndDisabled: {
								fontSize: 12
							}
						}}
					/>
				</Col>
				<Col md={3} className='justify-content-end'>
					<Dropdown
						label={showLabels ? 'Field Requirements' : undefined}
						placeholder='Select option'
						selectedKey={fieldRequirement}
						options={fieldRequirementOptions}
						onChange={(e, v) => {
							fieldGroup.current.fieldRequirement = v.key as string
							setFieldRequirement(v.key as string)
							handleFieldChange()
						}}
						styles={{
							title: {
								borderRadius: 4
							},
							dropdown: {
								fontSize: 12
							},
							dropdownItem: {
								fontSize: 12
							},
							dropdownItemSelected: {
								fontSize: 12
							},
							dropdownItemSelectedAndDisabled: {
								fontSize: 12
							}
						}}
					/>
				</Col>
				<Col md={1} className={cx(styles.deleteButton)}>
					{showDeleteButton && (
						<button onClick={() => onDelete?.()}>
							<Icon iconName='Cancel' className={cx(styles.buttonIcon)} />
						</button>
					)}
				</Col>
			</Row>
		</Col>
	)
}
export default FormBuilder
