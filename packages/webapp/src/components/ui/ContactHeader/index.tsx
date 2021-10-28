/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { ContactInfo } from '~ui/ContactInfo'
import { Contact, ContactStatus } from '@cbosuite/schema/dist/client-types'
import { memo } from 'react'
import { TagList } from '~components/lists/TagList'
import { Namespace, useTranslation } from '~hooks/useTranslation'

interface ContactHeaderProps {
	title?: string
	contact?: Contact
}

export const ContactHeader: StandardFC<ContactHeaderProps> = memo(function ContactHeader({
	contact
}) {
	const { t } = useTranslation(Namespace.Clients)
	if (!contact) {
		return null
	}

	const {
		name: { first, middle, last },
		address,
		email,
		phone,
		dateOfBirth
	} = contact

	const tags = contact.tags.map((t) => {
		return {
			id: t.id,
			orgId: t.orgId,
			label: t.label
		}
	})

	return (
		<div className={cx(styles.requestHeaderWrapper)}>
			<div className='mb-5'>
				<h3 className='mb-2'>
					{first} {middle} {last}{' '}
					{contact.status === ContactStatus.Archived && `(${t('archived')})`}
				</h3>
				{dateOfBirth && (
					<h5>
						{t('viewClient.header.dateOfBirth')}:{' '}
						{new Intl.DateTimeFormat('en-US').format(new Date(dateOfBirth))}
					</h5>
				)}
			</div>

			<Row className='no-gutters flex-column flex-md-row'>
				<Col className='mb-2 mb-md-0'>
					<>
						<h5 className='mb-2'>{t('viewClient.header.contact')}</h5>
						<ContactInfo contact={{ email, phone, address }} />
					</>
				</Col>
				<Col>
					{tags.length > 0 && (
						<>
							<h5 className='mb-2'>{t('viewClient.header.tags')}</h5>
							<TagList tags={tags} light />
						</>
					)}
				</Col>
			</Row>
			<div className='d-flex justify-content-between'>
				<div></div>
			</div>
		</div>
	)
})
