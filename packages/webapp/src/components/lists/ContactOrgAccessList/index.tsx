/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useEffect, useState } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { Delegate } from '@resolve/schema/lib/client-types'
import ClientOnly from '~ui/ClientOnly'
import cx from 'classnames'

import { Col, Row } from 'react-bootstrap'
import useWindowSize from '~hooks/useWindowSize'
import { Spinner } from '@fluentui/react'

interface ContactOrgAccessListProps extends ComponentProps {
	title?: string
	delegates?: Delegate[]
	loading?: boolean
}

const ContactOrgAccessList = memo(function ContactOrgAccessList({
	title,
	delegates,
	loading
}: ContactOrgAccessListProps): JSX.Element {
	const { isMD } = useWindowSize()
	const [isLoading, setIsLoading] = useState(loading)

	useEffect(() => {
		setIsLoading(loading)
	}, [loading])

	if (!delegates || delegates.length === 0) {
		return null
	}

	return (
		<ClientOnly>
			<div className={cx('mt-5 mb-5 pb-5')}>
				<Col className={isMD ? null : 'ps-2'}>
					<Row className='align-items-center mb-3'>
						<Col md={6} xs={12}>
							{!!title && <h2 className={cx('d-flex align-items-center')}>{title}</h2>}
						</Col>
					</Row>
					<Row className='mb-3'>
						<div>
							{
								'Below is a list of approved requests for personal information.  While these requests remain approved, delegates will have access to the listed item of personal data.  You may choose to stop sharing the requested data at any time.'
							}
						</div>
					</Row>
				</Col>
				<Col>
					<Row className={cx(styles.columnHeaderRow)}></Row>
					{!isLoading ? (
						<>
							<Row className={cx(styles.orgNameRow)}>
								<Col md={1}>
									<h4>{delegates[0].organization.name}</h4>
								</Col>
								<Col md={2}>
									<div className={cx(styles.orgNameButton)}>Deny all access</div>
								</Col>
								<Col></Col>
							</Row>
							<Row className={cx(styles.managedByRow)}>
								<Col>
									Managed by{' '}
									<span>
										{delegates[0].name.first} {delegates[0].name.last}
									</span>
								</Col>
							</Row>
							<Row className={cx(styles.permissionWrapper)}>
								{delegates[0].hasAccessTo?.map((permission, index) => {
									const oddEvenStyle = index % 2 === 0 ? styles.oddStyle : styles.evenStyle
									return (
										<Col md={6} key={index}>
											<Row className={cx(styles.permissionItem, oddEvenStyle)}>
												<Col>{permission}</Col>
												<Col className={cx('d-flex justify-content-end', styles.permissionButton)}>
													<div>Deny access</div>
												</Col>
											</Row>
										</Col>
									)
								})}
							</Row>
						</>
					) : (
						<Row>
							<div className={styles.loadingSpinner}>
								<Spinner size={1} />
								<span>Loading...</span>
							</div>
						</Row>
					)}
				</Col>
			</div>
		</ClientOnly>
	)
})
export default ContactOrgAccessList
