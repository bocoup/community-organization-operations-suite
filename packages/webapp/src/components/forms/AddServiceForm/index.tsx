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

interface AddServiceFormProps extends ComponentProps {
	title?: string
}

interface BaseFieldProps {
	id: string | number
	onDelete?: () => void
}

const AddServiceForm = memo(function AddServiceForm({}: AddServiceFormProps): JSX.Element {
	const BaseField = (props: BaseFieldProps) => {
		return (
			<Col className={cx(styles.baseFieldWrapper)} title={`field-${props.id}`}>
				<Row>
					<Col>
						<input
							name='fieldName'
							type='text'
							className={cx(styles.fieldNameField)}
							placeholder='Enter field name...'
						/>
					</Col>
					<Col md={2} className='justify-content-end'>
						<select title='fieldType' className={cx(styles.selectFieldType)}>
							<option value=''>Select field type...</option>
							<option value=''>Single Text Field</option>
							<option value=''>Multi-Text Field</option>
							<option value=''>Number</option>
							<option value=''>Date</option>
							<option value=''>Single-Choice</option>
							<option value=''>Multi-Choice</option>
						</select>
					</Col>
					<Col md={3} className='justify-content-end'>
						<select title='fieldRequirement' className={cx(styles.selectFieldRequirement)}>
							<option value=''>Select field requirement...</option>
							<option value=''>Required</option>
							<option value=''>Optional</option>
							<option value=''>Client Optional</option>
						</select>
					</Col>
				</Row>
			</Col>
		)
	}

	const defaultFields = [<BaseField key={1} id={1} />]

	const [fields, addFields] = useState(defaultFields)

	const onAddFieldClick = () => {
		const keyId = fields.length + 1
		addFields([...fields, <BaseField key={keyId} id={keyId} />])
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
				<Col md={7}>{fields}</Col>
			</Row>
		</Col>
	)
})
export default AddServiceForm
