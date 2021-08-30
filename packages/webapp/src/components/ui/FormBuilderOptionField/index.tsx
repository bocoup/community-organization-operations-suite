/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useRef, useEffect, useState, Fragment } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { Col, Row } from 'react-bootstrap'
import cx from 'classnames'
import Icon from '~ui/Icon'
import { TextField } from '@fluentui/react'
import { useTranslation } from '~hooks/useTranslation'

interface FormBuilderOptionFieldProps extends ComponentProps {
	options: string[]
	className?: string
	showDeleteButton?: boolean
	showAddButton?: boolean
	onChange?: (options: string[]) => void
	onDelete?: (index: number) => void
	onAdd?: (index: number) => void
}

const FormBuilderOptionField = memo(function FormBuilder({
	options,
	className,
	showDeleteButton = true,
	showAddButton = true,
	onChange,
	onDelete,
	onAdd
}: FormBuilderOptionFieldProps): JSX.Element {
	const fieldGroup = useRef<string[]>(options)
	const { t } = useTranslation('services')
	const [fieldOptions, setFieldOptions] = useState(options || [])

	useEffect(() => {
		setFieldOptions(options || [])
		fieldGroup.current = options
	}, [options, fieldGroup])

	const handleFieldChange = () => {
		if (onChange) {
			onChange(fieldGroup.current)
		}
	}

	const handleTextChange = (ev, index) => {
		const { value } = ev.target
		fieldGroup.current[index] = value
		setFieldOptions([...fieldGroup.current])
		handleFieldChange()
	}

	return (
		<Row className={cx(styles.fieldGroupWrapper, className)}>
			{fieldOptions.map((option, index) => (
				<Fragment key={index}>
					<Col lg={1} className='mb-2'>
						<Icon iconName='TurnRight' className={cx(styles.optionsArrow)}></Icon>
					</Col>
					<Col lg={6} className='mb-2'>
						<TextField
							name='optionLabel'
							placeholder={t('formBuilder.placeholders.fieldName')}
							value={fieldOptions[index]}
							onChange={(e) => {
								handleTextChange(e, index)
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
					<Col lg={1} className={cx('mb-2', styles.actionButtons)}>
						{showAddButton && (
							<button
								type='button'
								aria-label={t('formBuilder.buttons.addField')}
								onClick={() => onAdd?.(index)}
							>
								<Icon iconName='CircleAdditionSolid' className={cx(styles.addIcon)} />
							</button>
						)}
						{showDeleteButton && (
							<button
								type='button'
								aria-label={t('formBuilder.buttons.removeField')}
								onClick={() => onDelete?.(index)}
							>
								<Icon iconName='Blocked2Solid' className={cx(styles.removeIcon)} />
							</button>
						)}
					</Col>
					<Col lg={4} className='mb-2'></Col>
				</Fragment>
			))}
		</Row>
	)
})

export default FormBuilderOptionField
