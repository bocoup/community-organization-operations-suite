/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { StandardFC } from '~types/StandardFC'

interface ContainerRowColumnProps {
	size?: 'sm' | 'md' | 'lg'
}

/**
 * A single column wrapped in a row and container
 */
export const ContainerRowColumn: StandardFC<ContainerRowColumnProps> = memo(
	function ContainerRowColumn({ children, className, size = 'lg' }) {
		return (
			<Container className={className}>
				<Row>
					{size === 'sm' && <Col lg={{ span: 8, offset: 2 }}>{children}</Col>}
					{size === 'md' && <Col lg={{ span: 10, offset: 1 }}>{children}</Col>}
					{size === 'lg' && <Col>{children}</Col>}
				</Row>
			</Container>
		)
	}
)
