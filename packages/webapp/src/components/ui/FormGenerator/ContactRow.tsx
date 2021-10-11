/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Contact } from '@cbosuite/schema/dist/client-types'
import { FC, memo, useMemo } from 'react'
import { Col } from 'react-bootstrap'
import { useLocale } from '~hooks/useLocale'
import { ContactInfo } from '../ContactInfo'
import styles from './index.module.scss'

export const ContactRow: FC<{ contact: Contact }> = memo(function ContactRow({ contact }) {
	const [locale] = useLocale()
	const contactBlock = useMemo(
		() => ({
			email: contact.email,
			phone: contact.phone,
			address: contact.address
		}),
		[contact]
	)
	return (
		<Col md={6} className='mb-4'>
			<div className={styles.contactContainer}>
				<div className='d-block text-primary'>
					<strong>
						{contact.name.first} {contact.name.last}
					</strong>
				</div>
				<div className='d-block mb-2'>
					{/* TODO: localize this rogue string*/}
					Birthdate:{' '}
					<strong>{new Intl.DateTimeFormat(locale).format(new Date(contact.dateOfBirth))}</strong>
				</div>
				<div className={styles.contactInfo}>
					<ContactInfo contact={contactBlock} />
				</div>
			</div>
		</Col>
	)
})
