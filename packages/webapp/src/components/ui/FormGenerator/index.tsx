/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { TextField, DatePicker, Checkbox, ChoiceGroup, Label } from '@fluentui/react'
import { Col, Row, Container } from 'react-bootstrap'
import { Service, ServiceCustomField } from '@cbosuite/schema/lib/client-types'
import cx from 'classnames'

interface FormGeneratorProps extends ComponentProps {
	service: Service
}

const FormGenerator = memo(function FormGenerator({ service }: FormGeneratorProps): JSX.Element {
	const renderFields = (field: ServiceCustomField): JSX.Element => {
		if (field.fieldType === 'single-text' || field.fieldType === 'number') {
			return <TextField label={field.fieldName} required={field.fieldRequirements === 'required'} />
		}

		if (field.fieldType === 'multiline-text') {
			return (
				<TextField
					label={field.fieldName}
					autoAdjustHeight
					multiline
					required={field.fieldRequirements === 'required'}
				/>
			)
		}

		if (field.fieldType === 'date') {
			const today = new Date()
			return (
				<DatePicker
					label={field.fieldName}
					isRequired={field.fieldRequirements === 'required'}
					initialPickerDate={today}
					value={today}
				/>
			)
		}

		if (field.fieldType === 'single-choice') {
			return (
				<ChoiceGroup
					label={field.fieldName}
					required={field.fieldRequirements === 'required'}
					options={field?.fieldValue.map((c: string) => {
						return {
							key: `${c.replaceAll(' ', '_')}-__key`,
							text: c
						}
					})}
				/>
			)
		}

		if (field.fieldType === 'multi-choice') {
			return (
				<>
					<Label className='mb-3' required={field.fieldRequirements === 'required'}>
						{field.fieldName}
					</Label>
					{field?.fieldValue.map((c: string) => {
						return <Checkbox className='mb-3' key={`${c.replaceAll(' ', '_')}-__key`} label={c} />
					})}
				</>
			)
		}

		if (field.fieldType === 'multi-text') {
			return (
				<>
					{field?.fieldValue.map((c: string) => {
						return (
							<TextField
								className='mb-3'
								key={`${c.replaceAll(' ', '_')}-__key`}
								label={c}
								required={field.fieldRequirements === 'required'}
							/>
						)
					})}
				</>
			)
		}
	}

	return (
		<div className={styles.previewFormWrapper}>
			<Container>
				<Row className='mb-5'>
					<Col>
						<h3>{service?.name}</h3>
						<span>{service?.description}</span>
					</Col>
				</Row>
				<Row className='mt-3 mb-5'>
					<Col>
						{service?.customFields?.map((field, idx) => {
							return (
								<Row key={idx} className={cx('mb-3', styles.customField)}>
									{renderFields(field)}
								</Row>
							)
						})}
					</Col>
				</Row>
			</Container>
		</div>
	)
})
export default FormGenerator
