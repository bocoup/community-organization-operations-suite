/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ContactList } from '~lists/ContactList'
import { useState } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'
import { Title } from '~components/ui/Title'
import { NewFormPanel } from '~components/ui/NewFormPanel'

const ClientsPage = wrap(function Clients(): JSX.Element {
	const { t } = useTranslation('clients')
	const [openNewFormPanel, setOpenNewFormPanel] = useState(false)
	const title = t('pageTitle')
	return (
		<>
			<Title title={title} />
			<NewFormPanel
				showNewFormPanel={openNewFormPanel}
				newFormPanelName={'addClientForm'}
				onNewFormPanelDismiss={() => setOpenNewFormPanel(false)}
			/>
			<ContactList title={t('clientsTitle')} openAddClientForm={() => setOpenNewFormPanel(true)} />
		</>
	)
})

export default ClientsPage
