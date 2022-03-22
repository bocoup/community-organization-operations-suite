/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ContactList } from '~lists/ContactList'
import type { FC } from 'react'
import { useState } from 'react'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'
import { Title } from '~components/ui/Title'
import { NewFormPanel } from '~components/ui/NewFormPanel'

const ClientsPage: FC = wrap(function Clients() {
	const { t } = useTranslation(Namespace.Clients)
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
