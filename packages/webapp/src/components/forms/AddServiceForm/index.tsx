/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { Col, Row } from 'react-bootstrap'
import cx from 'classnames'
import Icon from '~ui/Icon'
import FormBuilder, { IFormBuilderFieldProps } from '~components/ui/FormBuilder'
interface AddServiceFormProps extends ComponentProps {
	title?: string
}

const AddServiceForm = memo(function AddServiceForm({}: AddServiceFormProps): JSX.Element {
	const [formFields, setFormFields] = useState<IFormBuilderFieldProps[]>([{ id: 'id_placeholder' }])

	const handleFieldDelete = (id: number) => {
		console.log('handleFieldDelete', id, formFields)
		const newFields = []
		for (let i = 0; i < formFields.length; i++) {
			if (i !== id) {
				newFields.push(formFields[i])
			}
		}
		console.log('newFields', newFields)
		setFormFields(newFields)
	}

	const handleFieldChange = (id: string, updatedField: IFormBuilderFieldProps) => {
		setFormFields(formFields.map(field => (field.id === id ? updatedField : field)))
		console.log('formFields', formFields)
	}

	const onAddFieldClick = () => {
		const newFields = [...formFields, { id: 'id_placeholder' }]
		setFormFields(newFields)
	}

	return (
		<Col className='mt-5 mb-5'>
			<Row className='align-items-center mb-3 justify-space-between'>
				<Col>
					<h2 className='d-flex align-items-center'>Add a New Service</h2>
				</Col>
				<Col className='d-flex justify-content-end'>
					<button className={cx(styles.addFormFieldButton)} onClick={() => onAddFieldClick()}>
						<span>Add Form Field</span>
						<Icon iconName='CircleAdditionSolid' className={cx(styles.buttonIcon)} />
					</button>
				</Col>
			</Row>
			<Row className='mt-5'>
				<Col md={5}>left side</Col>
				<Col md={7}>
					{formFields.map((field, index) => (
						<FormBuilder
							key={index}
							field={field}
							showLabels={index === 0}
							showDeleteButton={index > 0}
							onDelete={() => handleFieldDelete(index)}
							onChange={(id, field) => handleFieldChange(id, field)}
						/>
					))}
				</Col>
			</Row>
		</Col>
	)
})
export default AddServiceForm
