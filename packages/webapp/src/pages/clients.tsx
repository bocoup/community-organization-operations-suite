/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import ContactList from '~lists/ContactList'
import { memo, useState } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { wrap } from '~utils/appinsights'

const Clients = memo(function Clients(): JSX.Element {
	const { t } = useTranslation('clients')
	const [openNewFormPanel, setOpenNewFormPanel] = useState(false)

	return (
		<ContainerLayout
			documentTitle={t('pageTitle')}
			showNewFormPanel={openNewFormPanel}
			newFormPanelName={'addClientForm'}
			onNewFormPanelDismiss={() => setOpenNewFormPanel(false)}
		>
			<ContactList title={t('clientsTitle')} openAddClientForm={() => setOpenNewFormPanel(true)} />
		</ContainerLayout>
	)
})

export default wrap(Clients)
