/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import ContactList from '~lists/ContactList'
import { memo, useState } from 'react'
import { useTranslation } from '~hooks/useTranslation'

const Clients = memo(function Clients(): JSX.Element {
	const { t } = useTranslation('clients')
	const [openNewFormPanel, setOpenNewFormPanel] = useState(false)

	return (
		<ContainerLayout
			documentTitle={t('page.title')}
			showNewFormPanel={openNewFormPanel}
			newFormPanelName={'addClientForm'}
			onNewFormPanelDismiss={() => setOpenNewFormPanel(false)}
		>
			<ContactList title={t('clients.title')} openAddClientForm={() => setOpenNewFormPanel(true)} />
		</ContainerLayout>
	)
})

export default Clients
