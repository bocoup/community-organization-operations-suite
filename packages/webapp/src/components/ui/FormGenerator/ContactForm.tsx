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
import { organizationState, addedContactState } from '~store'

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
	const org = useRecoilValue(organizationState)
	const addedContact = useRecoilValue(addedContactState)
	const options = org?.contacts
		? org.contacts.filter((c) => c.status !== ContactStatus.Archived).map(transformClient)
		: []
	const [contacts, setContacts] = useState<OptionType[]>(empty)

	// When adding a contact in kiosk mode, we want to trigger the same update as if
	// we had selected a one from the dropdown.
	useEffect(() => {
		if (addedContact) {
			if (kioskMode) {
				const newContactOption = transformClient(addedContact)
				setContacts([newContactOption])
				mgr.value.contacts = [addedContact.id]
				onContactsChange([addedContact])
				onChange(mgr.isSubmitEnabled())
			} else {
				const newContactOption = transformClient(addedContact)
				const allFormContacts = [...contacts, newContactOption]
				setContacts(allFormContacts)
				const filteredContacts = allFormContacts.map((c) =>
					org.contacts?.find((cc) => cc.id === c.value)
				)
				onContactsChange(filteredContacts)
				mgr.value.contacts = filteredContacts.map((c) => c.id)
				onChange(mgr.isSubmitEnabled())
			}
		}
	}, [addedContact, kioskMode, mgr, onChange, onContactsChange])

	return (
		<Row className='flex-column flex-md-row mb-4 align-items-end'>
			{!kioskMode && (
				<Col className='mb-3 mb-md-0'>
					<div className={cx(styles.clientField)}>
						{t('formGenerator.addExistingClient')}
						<span className='text-danger'> *</span>
					</div>
					{/* TODO: programmatically  set selected client pills*/}
					<ReactSelect
						isMulti
						placeholder={t('formGenerator.addClientPlaceholder')}
						options={options}
						defaultValue={contacts}
						onChange={(value) => {
							const newOptions = value as unknown as OptionType[]
							setContacts(newOptions)
							const filteredContacts = newOptions.map((c) =>
								org.contacts?.find((cc) => cc.id === c.value)
							)
							onContactsChange(filteredContacts)
							mgr.value.contacts = filteredContacts.map((c) => c.id)
							onChange(mgr.isSubmitEnabled())
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
					{/* TODO: get name from dropdown */}
					<button className={styles.newClientButton} onClick={() => onAddNewClient('Marky Markus')}>
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
