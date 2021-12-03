/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState, useCallback, useRef, useEffect } from 'react'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { Col, Row } from 'react-bootstrap'
import cx from 'classnames'
import { Icon, TextField } from '@fluentui/react'

import { Namespace, useTranslation } from '~hooks/useTranslation'
import { IFormBuilderFieldValueProps } from '../FormBuilderField'
import { noop } from '~utils/noop'
import { moveDown, moveUp } from '~utils/lists'

interface FormBuilderOptionFieldProps {
	options: IFormBuilderFieldValueProps[]
	className?: string
	showDeleteButton?: boolean
	showAddButton?: boolean
	onChange?: (options: IFormBuilderFieldValueProps[]) => void
	onDelete?: (index: number) => void
	onAdd?: (index: number) => void
}

export const FormBuilderOptionField: StandardFC<FormBuilderOptionFieldProps> = memo(
	function FormBuilder({
		options,
		className,
		showDeleteButton = true,
		showAddButton = true,
		onChange = noop,
		onDelete = noop,
		onAdd = noop
	}) {
		const fieldGroup = useRef<IFormBuilderFieldValueProps[]>(options)
		const { t } = useTranslation(Namespace.Services)
		const [fieldOptions, setFieldOptions] = useState(options || [])

		useEffect(() => {
			setFieldOptions(options || [])
			fieldGroup.current = options
		}, [options, fieldGroup])

		const handleFieldChange = useCallback(() => {
			onChange(fieldGroup.current)
		}, [onChange])

		const handleChangeOptions = useCallback(
			(options: IFormBuilderFieldValueProps[]) => {
				setFieldOptions(options)
				fieldGroup.current = options
				handleFieldChange()
			},
			[handleFieldChange]
		)

		const handleTextChange = useCallback(
			(ev, index) => {
				const { value } = ev.target
				const newOptions = [...fieldOptions]
				newOptions[index] = { ...newOptions[index], id: newOptions[index].id || '', label: value }
				setFieldOptions(newOptions)
				fieldGroup.current = newOptions
				handleFieldChange()
			},
			[fieldOptions, handleFieldChange]
		)

		const onMoveUp = useCallback(
			(index: number) => {
				handleChangeOptions(moveUp(index, fieldOptions))
			},
			[fieldOptions, handleChangeOptions]
		)

		const onMoveDown = useCallback(
			(index: number) => {
				handleChangeOptions(moveDown(index, fieldOptions))
			},
			[fieldOptions, handleChangeOptions]
		)

		return (
			<Row className={cx(styles.fieldGroupWrapper, className)}>
				{fieldOptions.map((option, index) => (
					<Row key={index}>
						<Col lg={2} className='mb-2'>
							<Icon iconName='TurnRight' className={cx(styles.optionsArrow)}></Icon>
							<Icon
								className={styles.sortAction}
								iconName='SortUp'
								onClick={() => onMoveUp(index)}
							/>
							<Icon
								className={styles.sortAction}
								iconName='SortDown'
								onClick={() => onMoveDown(index)}
							/>
						</Col>

						<Col lg={6} className='mb-2'>
							<TextField
								name='optionLabel'
								placeholder={t('formBuilderOptionField.placeholders.fieldName')}
								value={fieldOptions[index].label}
								onChange={(e) => {
									handleTextChange(e, index)
								}}
								className='mb-3 mb-lg-0'
								styles={textFieldStyle}
							/>
						</Col>
						<Col lg={1} className={cx('mb-2', styles.actionButtons)}>
							{showAddButton && (
								<button
									type='button'
									aria-label={t('formBuilderOptionField.buttons.addField')}
									onClick={() => onAdd(index)}
								>
									<Icon iconName='CircleAdditionSolid' className={cx(styles.addIcon)} />
								</button>
							)}
							{showDeleteButton && (
								<button
									type='button'
									aria-label={t('formBuilderOptionField.buttons.removeField')}
									onClick={() => onDelete(index)}
								>
									<Icon iconName='Blocked2Solid' className={cx(styles.removeIcon)} />
								</button>
							)}
						</Col>
						<Col lg={4} className='mb-2'></Col>
					</Row>
				))}
			</Row>
		)
	}
)

const textFieldStyle = {
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
}
