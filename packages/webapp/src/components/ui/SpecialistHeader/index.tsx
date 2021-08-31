/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { RoleType, User } from '@cbosuite/schema/lib/client-types'
import ContactInfo from '~ui/ContactInfo'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'

interface SpecialistHeaderProps extends ComponentProps {
	title?: string
	specialist: User
}

const RequestHeader = memo(function RequestHeader({
	specialist
}: SpecialistHeaderProps): JSX.Element {
	const { t } = useTranslation('specialists')
	if (!specialist) {
		return null
	}

	const { name, address, userName, email, phone } = specialist

	const contactInfo = { email, phone, address }

	const permission =
		specialist.roles.filter((r) => r.roleType === RoleType.Admin).length > 0
			? t('viewSpecialist.header.roles.admin')
			: t('viewSpecialist.header.roles.user')

	return (
		<div className={cx(styles.specialistHeaderWrapper)}>
			<div className='mb-5'>
				<h3 className='mb-2'>
					{name.first} {name.last}
				</h3>
				<h5>@{userName}</h5>
			</div>

			<Row className='no-gutters flex-column flex-md-row'>
				<Col className='mb-2 mb-md-0'>
					<>
						<h5 className='mb-2'>{t('viewSpecialist.header.contact')}</h5>
						<ContactInfo contact={contactInfo} />
					</>
				</Col>
				<Col>
					<>
						<h5 className='mb-2'>{t('viewSpecialist.header.status')}</h5>
						<div>{t('viewSpecialist.header.activeStatus')}</div>
						<h5 className='mt-4 mb-2'>{t('viewSpecialist.header.permissions')}</h5>
						<div>{permission}</div>
					</>
				</Col>
			</Row>
			<div className='d-flex justify-content-between'>
				<div></div>
			</div>
		</div>
	)
})
export default RequestHeader
