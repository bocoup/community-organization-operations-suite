/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import { Icon } from '@fluentui/react'
import type { FC } from 'react'
import { useEffect, memo, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { ReactSelect } from '../ReactSelect'
import styles from './index.module.scss'
import type { FormFieldManager } from './FormFieldManager'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { empty } from '~utils/noop'
import type { Contact } from '@cbosuite/schema/dist/client-types'
import { ContactStatus } from '@cbosuite/schema/dist/client-types'
import type { OptionType } from '../FormikSelect'
import { useRecoilValue } from 'recoil'
import { addedContactState } from '~store'
import { useOrganization } from '~hooks/api/useOrganization'
import { useCurrentUser } from '~hooks/api/useCurrentUser'

const LOCAL_ONLY_ID_PREFIX = 'LOCAL_'

export const ContactForm: FC<{
	previewMode: boolean
	kioskMode: boolean
	mgr: FormFieldManager
	onContactsChange: (contacts: Contact[]) => void
	onAddNewClient: (name: string) => void
	onChange: (submitEnabled: boolean) => void
}> = memo(function ContactForm({
	previewMode,
	kioskMode,
	mgr,
	onAddNewClient,
	onChange,
	onContactsChange
}) {
	const { t } = useTranslation(Namespace.Services)
	const { orgId } = useCurrentUser()
	const { organization } = useOrganization(orgId)
	const addedContact = useRecoilValue(addedContactState)
	const options = organization?.contacts
		? organization.contacts.filter((c) => c.status !== ContactStatus.Archived).map(transformClient)
		: []
	const [contacts, setContacts] = useState<OptionType[]>(empty)
	const [contactNameInput, setContactNameInput] = useState<string>('')
	const [contactNameInputBeforeBlur, setContactNameInputBeforeBlur] = useState<string>('')

	const updateContacts = (contacts: OptionType[]) => {
		setContacts(contacts)
		const filteredContacts = contacts
			.map((c) => organization?.contacts?.find((cc) => cc.id === c.value))
			.filter((c) => !!c)
		onContactsChange(filteredContacts)
		mgr.value.contacts = filteredContacts.map((c) => c.id)
		onChange(mgr.isSubmitEnabled())
	}

	// When adding a contact in kiosk mode, we want to trigger the same update as if
	// we had selected a one from the dropdown.
	useEffect(() => {
		if (addedContact && addedContact.contact) {
			const newContactOption = transformClient(addedContact.contact)

			let allFormContacts = []
			const localContactIndex = contacts.findIndex(
				(contact) => contact.value === addedContact.localId
			)

			if (kioskMode) {
				allFormContacts = [newContactOption]
			} else if (
				addedContact.contact.id.startsWith(LOCAL_ONLY_ID_PREFIX) ||
				localContactIndex < 0
			) {
				allFormContacts = [...contacts, newContactOption]
			} else {
				allFormContacts = [...contacts]
				allFormContacts[localContactIndex] = newContactOption
			}
			updateContacts(allFormContacts)
		}
	}, [addedContact, kioskMode, mgr, onChange, onContactsChange]) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<Row className='flex-column flex-md-row mb-4 align-items-end'>
			{!kioskMode && (
				<Col className='mb-3 mb-md-0'>
					<div className={cx(styles.clientField)}>
						{t('formGenerator.addExistingClient')}
						<span className='text-danger'> *</span>
					</div>
					<ReactSelect
						isMulti
						placeholder={t('formGenerator.addClientPlaceholder')}
						options={options}
						defaultValue={contacts}
						values={contacts}
						onChange={(value) => {
							const newOptions = value as unknown as OptionType[]
							updateContacts(newOptions)
						}}
						onInputChange={(value) => {
							setContactNameInput(value)
						}}
						onBlur={() => {
							setContactNameInputBeforeBlur(contactNameInput)
						}}
						onFocus={() => {
							setContactNameInputBeforeBlur('')
						}}
					/>
				</Col>
			)}
			{kioskMode && (
				<Col className='mb-3 mb-md-0'>
					<div className={cx(styles.clientField)}>
						{t('formGenerator.buttons.addNewClient')}
						<span className='text-danger'> *</span>
					</div>
				</Col>
			)}
			{!previewMode && (
				<Col md={3} className='mb-3 mb-md-0'>
					<button
						className={styles.newClientButton}
						onClick={() => {
							onAddNewClient(contactNameInputBeforeBlur)
							setContactNameInputBeforeBlur('')
						}}
					>
						<span>{t('formGenerator.buttons.addNewClient')}</span>
						<Icon iconName='CircleAdditionSolid' className={cx(styles.buttonIcon)} />
					</button>
				</Col>
			)}
		</Row>
	)
})

function transformClient(client: Contact): OptionType {
	return {
		label: `${client.name.first} ${client.name.last}`,
		value: client.id.toString()
	}
}
