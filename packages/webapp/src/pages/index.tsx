/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useEngagementList } from '~hooks/api/useEngagementList'
import ContainerLayout from '~layouts/ContainerLayout'
import MyRequestsList from '~lists/MyRequestsList'
import RequestList from '~lists/RequestList'
import InactiveRequestList from '~lists/InactiveRequestList'
import { useTranslation } from '~hooks/useTranslation'
import { memo, useState } from 'react'
import { useInactiveEngagementList } from '~hooks/api/useInactiveEngagementList'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import PageTopButtons, { IPageTopButtons } from '~components/ui/PageTopButtons'
import { wrap } from '~utils/appinsights'
import { Title } from '~components/ui/Title'
import { NewFormPanel } from '~components/ui/NewFormPanel'

const Home = memo(function Home(): JSX.Element {
	const { t } = useTranslation('requests')
	const { userId, orgId } = useCurrentUser()
	const {
		engagementList,
		myEngagementList,
		addEngagement: addRequest,
		editEngagement: editRequest,
		claimEngagement: claimRequest,
		loading
	} = useEngagementList(orgId, userId)

	const { inactiveEngagementList, loading: inactiveLoading } = useInactiveEngagementList(orgId)

	const [openNewFormPanel, setOpenNewFormPanel] = useState(false)
	const [newFormName, setNewFormName] = useState(null)

	const handleEditMyEngagements = async (form: any) => {
		await handleEditEngagements({
			...form,
			userId
		})
	}

	const handleAddEngagements = async (form: any) => {
		await addRequest(form)
	}

	const handleEditEngagements = async (form: any) => {
		await editRequest(form)
	}

	const handleClaimEngagements = async (form: any) => {
		await claimRequest(form.id, userId)
	}

	const buttons: IPageTopButtons[] = [
		{
			title: t('requestPageTopButtons.newRequestTitle'),
			buttonName: t('requestPageTopButtons.newRequestButtonName'),
			iconName: 'CircleAdditionSolid',
			onButtonClick: () => {
				setOpenNewFormPanel(true)
				setNewFormName('addRequestForm')
			}
		},
		{
			title: t('requestPageTopButtons.newServiceTitle'),
			buttonName: t('requestPageTopButtons.newServiceButtonName'),
			onButtonClick: () => {
				setOpenNewFormPanel(true)
				setNewFormName('startServiceForm')
			}
		},
		{
			title: t('requestPageTopButtons.newClientTitle'),
			buttonName: t('requestPageTopButtons.newClientButtonName'),
			iconName: 'CircleAdditionSolid',
			onButtonClick: () => {
				setOpenNewFormPanel(true)
				setNewFormName('addClientForm')
			}
		}
	]

	const handleNewFormPanelSubmit = (values: any) => {
		switch (newFormName) {
			case 'addRequestForm':
				handleAddEngagements(values)
				break
		}
	}
	const title = t('pageTitle')

	return (
		<ContainerLayout>
			<Title title={title} />
			<NewFormPanel
				showNewFormPanel={openNewFormPanel}
				newFormPanelName={newFormName}
				onNewFormPanelDismiss={() => setOpenNewFormPanel(false)}
				onNewFormPanelSubmit={handleNewFormPanelSubmit}
			/>
			<PageTopButtons buttons={buttons} />
			<MyRequestsList
				title={t('myRequestsTitle')}
				requests={myEngagementList}
				onEdit={handleEditMyEngagements}
				loading={loading && myEngagementList.length === 0}
			/>
			<RequestList
				title={t('requestsTitle')}
				requests={engagementList}
				onEdit={handleEditEngagements}
				onClaim={handleClaimEngagements}
				loading={loading && engagementList.length === 0}
			/>
			<InactiveRequestList
				title={t('closedRequestsTitle')}
				requests={inactiveEngagementList}
				loading={inactiveLoading && inactiveEngagementList.length === 0}
			/>
		</ContainerLayout>
	)
})

export default wrap(Home)
