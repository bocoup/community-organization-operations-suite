/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Col, Container, Row } from 'react-bootstrap'
import ComponentProps from '~types/ComponentProps'

interface CopntainerRowColumnProps extends ComponentProps {
	size?: 'sm' | 'md' | 'lg'
}
/**
 * A single column wrapped in a row and container
 */
export default function ContainerRowColumn({
	children,
	size = 'lg'
}: CopntainerRowColumnProps): JSX.Element {
	return (
		<Container>
			<Row>
				{size === 'sm' && <Col lg={{ span: 8, offset: 2 }}>{children}</Col>}
				{size === 'md' && <Col lg={{ span: 10, offset: 1 }}>{children}</Col>}
				{size === 'lg' && <Col>{children}</Col>}
			</Row>
		</Container>
	)
}
