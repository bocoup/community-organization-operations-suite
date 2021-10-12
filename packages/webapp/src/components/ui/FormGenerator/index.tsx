/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import { memo, useState } from 'react'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { Container } from 'react-bootstrap'
import { Service, ServiceAnswerInput, ServiceAnswers } from '@cbosuite/schema/dist/client-types'
import type { Contact } from '@cbosuite/schema/dist/client-types'
import { empty, noop } from '~utils/noop'
import { useFormFieldManager } from './FormFieldManager'
import { ContactList } from './ContactList'
import { FieldViewList } from './FieldViewList'
import { ActionRow } from './ActionRow'
import { ContactForm } from './ContactForm'
import { useContactSynchronization, useSubmitHandler } from './hooks'
import { ServiceHeader } from './ServiceHeader'

interface FormGeneratorProps {
	service: Service
	previewMode?: boolean
	editMode?: boolean
	record?: ServiceAnswers
	onAddNewClient?: () => void
	onQuickActions?: () => void
	onSubmit?: (values: ServiceAnswerInput) => void
}

export const FormGenerator: StandardFC<FormGeneratorProps> = memo(function FormGenerator({
	service,
	previewMode = true,
	editMode = false,
	record,
	onSubmit = noop,
	onAddNewClient = noop,
	onQuickActions = noop
}) {
	const [contacts, setContacts] = useState<Contact[]>(empty)
	const [isSubmitEnabled, setSubmitEnabled] = useState(false)
	const mgr = useFormFieldManager(service)
	const handleSubmit = useSubmitHandler(mgr, contacts, onSubmit)
	useContactSynchronization(mgr, record, editMode, setContacts)
	const isContactFormShown = !editMode && service?.contactFormEnabled

	return (
		<div
			className={cx({
				[styles.previewFormWrapper]: !editMode
			})}
		>
			<Container>
				<ServiceHeader service={service} />
				{!isContactFormShown ? null : (
					<ContactForm
						mgr={mgr}
						previewMode={previewMode}
						onAddNewClient={onAddNewClient}
						onChange={setSubmitEnabled}
						onContactsChange={setContacts}
					/>
				)}
				<ContactList contacts={contacts} />
				<FieldViewList
					service={service}
					mgr={mgr}
					editMode={editMode}
					previewMode={previewMode}
					onChange={setSubmitEnabled}
					record={record}
				/>
				{previewMode ? null : (
					<ActionRow
						isSubmitEnabled={isSubmitEnabled}
						onSubmit={handleSubmit}
						onQuickActions={onQuickActions}
					/>
				)}
			</Container>
		</div>
	)
})
