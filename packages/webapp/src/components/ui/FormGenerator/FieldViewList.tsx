/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import { Service, ServiceAnswers } from '@cbosuite/schema/dist/client-types'
import { FC, memo } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FieldView } from './FieldView'
import styles from './index.module.scss'
import { FormFieldManager } from './FormFieldManager'

export const FieldViewList: FC<{
	service: Service
	mgr: FormFieldManager
	editMode: boolean
	previewMode: boolean
	onChange: (enabled: boolean) => void
	record: ServiceAnswers
}> = memo(function FieldViewList({ service, mgr, editMode, previewMode, onChange, record }) {
	return (
		<Row className='mt-3 mb-5'>
			<Col>
				{service?.customFields?.map((field, idx) => {
					return (
						<Row key={idx} className={cx('mb-3', styles.customField)}>
							<FieldView
								field={field}
								mgr={mgr}
								editMode={editMode}
								previewMode={previewMode}
								onChange={onChange}
								record={record}
							/>
						</Row>
					)
				})}
			</Col>
		</Row>
	)
})
