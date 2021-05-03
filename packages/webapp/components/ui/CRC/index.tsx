import { Col, Container, Row } from 'react-bootstrap'
import CP from '~types/ComponentProps'

/**
 * A single column wrapped in a row and container
 */
export default function ContainerRowColumn({ children }: CP): JSX.Element {
	return (
		<Container>
			<Row>
				<Col>{children}</Col>
			</Row>
		</Container>
	)
}
