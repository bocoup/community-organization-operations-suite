/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEngagementList } from '~hooks/api/useEngagementList'
import { MyRequestsList } from '~lists/MyRequestsList'
import { RequestList } from '~lists/RequestList'
import { InactiveRequestList } from '~lists/InactiveRequestList'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import type { FC } from 'react'
import { useCallback, useState } from 'react'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import type { IPageTopButtons } from '~components/ui/PageTopButtons'
import { PageTopButtons } from '~components/ui/PageTopButtons'
import { wrap } from '~utils/appinsights'
import { Title } from '~components/ui/Title'
import { NewFormPanel } from '~components/ui/NewFormPanel'

const HomePage: FC = wrap(function Home() {
	const { t } = useTranslation(Namespace.Requests)
	const { userId, orgId } = useCurrentUser()
	const { addEngagement } = useEngagementList(orgId, userId)

	const [openNewFormPanel, setOpenNewFormPanel] = useState(false)
	const [newFormName, setNewFormName] = useState(null)

	// Subscribe to engagement updates
	// const subscriptionResult = useSubscription(SUBSCRIBE_TO_ORG_ENGAGEMENTS, {
	// 	variables: { orgId }
	// })

	const buttons: IPageTopButtons[] = [
		{
			title: t('requestPageTopButtons.newRequestTitle'),
			buttonName: t('requestPageTopButtons.newRequestButtonName'),
			iconName: 'CircleAdditionSolid',
			className: 'btnNewRequest',
			onButtonClick: () => {
				setOpenNewFormPanel(true)
				setNewFormName('addRequestForm')
			}
		},
		{
			title: t('requestPageTopButtons.newServiceTitle'),
			buttonName: t('requestPageTopButtons.newServiceButtonName'),
			className: 'btnStartService',
			onButtonClick: () => {
				setOpenNewFormPanel(true)
				setNewFormName('startServiceForm')
			}
		},
		{
			title: t('requestPageTopButtons.newClientTitle'),
			buttonName: t('requestPageTopButtons.newClientButtonName'),
			iconName: 'CircleAdditionSolid',
			className: 'btnAddClient',
			onButtonClick: () => {
				setOpenNewFormPanel(true)
				setNewFormName('addClientForm')
			}
		}
	]

	const handleNewFormPanelSubmit = useCallback(
		(values: any) => {
			switch (newFormName) {
				case 'addRequestForm':
					addEngagement(values)
					break
			}
		},
		[addEngagement, newFormName]
	)

	return (
		<>
			<Title title={t('pageTitle')} />

			<NewFormPanel
				showNewFormPanel={openNewFormPanel}
				newFormPanelName={newFormName}
				onNewFormPanelDismiss={() => setOpenNewFormPanel(false)}
				onNewFormPanelSubmit={handleNewFormPanelSubmit}
			/>
			<PageTopButtons buttons={buttons} />
			<MyRequestsList />
			<RequestList />
			<InactiveRequestList />
		</>
	)
})

export default HomePage
