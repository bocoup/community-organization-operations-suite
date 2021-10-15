/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import { Icon } from '@fluentui/react'
import { FC, memo, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { ReactSelect } from '../ReactSelect'
import styles from './index.module.scss'
import { FormFieldManager } from './FormFieldManager'
import { useTranslation } from '~hooks/useTranslation'
import { empty } from '~utils/noop'
import { Contact } from '@cbosuite/schema/dist/client-types'
import { OptionType } from '../FormikSelect'
import { useRecoilValue } from 'recoil'
import { organizationState } from '~store'

export const ContactForm: FC<{
	previewMode: boolean
	mgr: FormFieldManager
	onContactsChange: (contacts: Contact[]) => void
	onAddNewClient: () => void
	onChange: (submitEnabled: boolean) => void
}> = memo(function ContactForm({ previewMode, mgr, onAddNewClient, onChange, onContactsChange }) {
	const { t } = useTranslation('services')
	const org = useRecoilValue(organizationState)
	const defaultOptions = org.contacts ? org.contacts.map(transformClient) : empty
	const [contacts, setContacts] = useState<OptionType[]>(empty)

	return (
		<Row className='flex-column flex-md-row mb-4 align-items-end'>
			<Col className='mb-3 mb-md-0'>
				<div className={cx(styles.clientField)}>
					{t('formGenerator.addExistingClient')}
					<span className='text-danger'> *</span>
				</div>
				<ReactSelect
					isMulti
					placeholder={t('formGenerator.addClientPlaceholder')}
					options={defaultOptions}
					defaultValue={contacts}
					onChange={(value) => {
						const newOptions = value as unknown as OptionType[]
						setContacts(newOptions)
						const filteredContacts = newOptions.map((c) =>
							org.contacts?.find((cc) => cc.id === c.value)
						)
						onContactsChange(filteredContacts)
						mgr.contacts = filteredContacts.map((c) => c.id)
						onChange(mgr.isSubmitEnabled())
					}}
				/>
			</Col>
			{!previewMode && (
				<Col md={3} className='mb-3 mb-md-0'>
					<button className={styles.newClientButton} onClick={onAddNewClient}>
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
