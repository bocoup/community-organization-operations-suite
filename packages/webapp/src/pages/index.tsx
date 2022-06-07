/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEngagementList } from '~hooks/api/useEngagementList'
// import { MyRequestsList } from '~lists/MyRequestsList'
import { RequestList } from '~lists/RequestList'
import { InactiveRequestList } from '~lists/InactiveRequestList'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import type { FC } from 'react'
import { useCallback, useState } from 'react'
import { useInactiveEngagementList } from '~hooks/api/useInactiveEngagementList'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import type { IPageTopButtons } from '~components/ui/PageTopButtons'
import { PageTopButtons } from '~components/ui/PageTopButtons'
import { wrap } from '~utils/appinsights'
import { Title } from '~components/ui/Title'
import { NewFormPanel } from '~components/ui/NewFormPanel'

const HomePage: FC = wrap(function Home() {
	const { t } = useTranslation(Namespace.Requests)
	const { userId, orgId } = useCurrentUser()
	const {
		addEngagement: addRequest
		//editEngagement: editRequest,
		// claimEngagement: claimRequest
	} = useEngagementList(orgId, userId)

	const { inactiveEngagementList, loading: inactiveLoading } = useInactiveEngagementList(orgId)
	const [openNewFormPanel, setOpenNewFormPanel] = useState(false)
	const [newFormName, setNewFormName] = useState(null)

	// const handleEditMyEngagements = async (form: any) => {
	// 	await editRequest({
	// 		...form
	// 	})
	// }

	// const handleClaimEngagements = (form: any) => {
	// 	claimRequest(form.id, userId)
	// }

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
					addRequest(values)
					break
			}
		},
		[addRequest, newFormName]
	)
	const title = t('pageTitle')

	return (
		<>
			<Title title={title} />

			<NewFormPanel
				showNewFormPanel={openNewFormPanel}
				newFormPanelName={newFormName}
				onNewFormPanelDismiss={() => setOpenNewFormPanel(false)}
				onNewFormPanelSubmit={handleNewFormPanelSubmit}
			/>
			<PageTopButtons buttons={buttons} />
			{/* <MyRequestsList
				title={t('myRequestsTitle')}
				requests={myEngagementList}
				onEdit={handleEditMyEngagements}
				loading={loading && myEngagementList.length === 0}
			/> */}
			<RequestList />
			<InactiveRequestList
				title={t('closedRequestsTitle')}
				requests={inactiveEngagementList}
				loading={inactiveLoading && inactiveEngagementList.length === 0}
			/>
		</>
	)
})

export default HomePage
