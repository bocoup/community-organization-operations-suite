/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FC } from 'react'
import { memo } from 'react'
import type { Service } from '@cbosuite/schema/dist/client-types'
import { Row, Col } from 'react-bootstrap'

export const ServiceHeader: FC<{ service: Service }> = memo(function ServiceHeader({ service }) {
	return (
		<Row className='mb-5'>
			<Col>
				<h3 className='mb-3'>{service?.name}</h3>
				<span>{service?.description}</span>
			</Col>
		</Row>
	)
})
