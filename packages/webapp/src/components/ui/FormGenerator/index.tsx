/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import { memo, useState } from 'react'
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { Container } from 'react-bootstrap'
import type {
	Service,
	ServiceAnswerInput,
	ServiceAnswer,
	Contact
} from '@cbosuite/schema/dist/client-types'
import { empty, noop } from '~utils/noop'
import { useFormFieldManager } from './FormFieldManager'
import { ContactList } from './ContactList'
import { FieldViewList } from './FieldViewList'
import { ActionRow } from './ActionRow'
import { ContactForm } from './ContactForm'
import { IconButton } from '~components/ui/IconButton'
import { useContactSynchronization, useSubmitHandler } from './hooks'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { ServiceHeader } from './ServiceHeader'
import { useHistory } from 'react-router-dom'
import { navigate } from '~utils/navigate'
import { ApplicationRoute } from '~types/ApplicationRoute'
interface FormGeneratorProps {
	service: Service
	previewMode?: boolean
	editMode?: boolean
	kioskMode?: boolean
	record?: ServiceAnswer
	onAddNewClient?: (name: string) => void
	onQuickActions?: () => void
	onSubmit?: (values: ServiceAnswerInput) => void
}

export const FormGenerator: StandardFC<FormGeneratorProps> = memo(function FormGenerator({
	service,
	previewMode = true,
	editMode = false,
	kioskMode = false,
	record,
	onSubmit = noop,
	onAddNewClient = noop,
	// Not nooped because it's truthiness is used to conditionally render the quickActions button
	onQuickActions
}) {
	const [contacts, setContacts] = useState<Contact[]>(empty)
	const [isSubmitEnabled, setSubmitEnabled] = useState(false)
	const mgr = useFormFieldManager(service, record)
	const handleSubmit = useSubmitHandler(mgr, contacts, onSubmit)
	useContactSynchronization(mgr, record, editMode, setContacts)
	const isContactFormShown = !editMode && service?.contactFormEnabled
	const { t } = useTranslation(Namespace.Services)
	const history = useHistory()

	return (
		<div
			className={cx({
				[styles.previewFormWrapper]: !editMode
			})}
		>
			<Container>
				<div className={styles.header}>
					{kioskMode && (
						<IconButton
							className={styles.headerButton}
							icon='ChevronLeft'
							text={t('serviceReturnToServices')}
							onClick={() => {
								navigate(history, ApplicationRoute.ServicesKiosk)
							}}
						/>
					)}
					<ServiceHeader service={service} />
					{
						kioskMode && (
							<div className={styles.headerButton}></div>
						) /* Invisible flex item to keep service title centered */
					}
				</div>
				{isContactFormShown && (
					<ContactForm
						mgr={mgr}
						previewMode={previewMode}
						kioskMode={kioskMode}
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
				/>
				{!previewMode && (
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
