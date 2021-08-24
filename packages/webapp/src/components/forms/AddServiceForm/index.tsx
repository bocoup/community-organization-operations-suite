/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { Col, Row } from 'react-bootstrap'
import cx from 'classnames'

interface AddServiceFormProps extends ComponentProps {
	title?: string
}

const AddServiceForm = memo(function AddServiceForm({}: AddServiceFormProps): JSX.Element {
	return (
		<Col className='mt-5 mb-5'>
			<Row className='align-items-center mb-3'>
				<Col>
					<h2 className='d-flex align-items-center'>Add a New Service</h2>
				</Col>
			</Row>
			<Row className='mt-5'>
				<Col md={4}>left side</Col>
				<Col md={8}>right side</Col>
			</Row>
		</Col>
	)
})
export default AddServiceForm
