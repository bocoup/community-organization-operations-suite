/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Contact } from '@cbosuite/schema/dist/client-types'
import { FC, memo } from 'react'
import { Row } from 'react-bootstrap'
import { ContactRow } from './ContactRow'

export const ContactList: FC<{
	contacts: Contact[]
}> = memo(function ContactList({ contacts }) {
	return contacts.length > 0 ? (
		<Row>
			{contacts.map((contact, index) => (
				<ContactRow contact={contact} key={contact?.id + ':' + index} />
			))}
		</Row>
	) : null
})
