/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useEffect } from 'react'
import MyDataLayout from '~components/layouts/MyDataLayout'
import DelegatesList from '~components/lists/DelegatesList'
import getServerSideTranslations from '~utils/getServerSideTranslations'
import { useCurrentUser } from '~hooks/api/useCurrentuser'
import { useDelegates } from '~hooks/api/useDelegates'
import ContactEngagementList from '~components/lists/ContactEngagementList'
import { useContactEngagementList } from '~hooks/api/useContactEngagementList'
import ContactOrgAccessList from '~components/lists/ContactOrgAccessList'
import DataAccessRequestList from '~components/lists/DataAccessRequestList'

export const getStaticProps = getServerSideTranslations(['common', 'footer'])

const MyDataPage = memo(function MyDataPage(): JSX.Element {
	const { currentUser } = useCurrentUser()
	const { loadDelegates, delegates, loading: loadingDelegates } = useDelegates()
	const {
		loadContactEngagements,
		contactActiveEngagementList,
		loading: loadingContactEngagementList
	} = useContactEngagementList()

	useEffect(() => {
		if (currentUser) {
			loadDelegates(currentUser.id)
			loadContactEngagements(currentUser.id)
		}
	}, [currentUser])

	return (
		<MyDataLayout documentTitle={'Manage My Data'}>
			<DataAccessRequestList
				title={'Data Access Requests'}
				delegates={delegates}
				loading={loadingDelegates}
			/>
			<ContactEngagementList
				title={'Your Assistance Requests'}
				contactEngagementList={contactActiveEngagementList}
				loading={loadingContactEngagementList}
			/>
			<ContactOrgAccessList
				title={'Manage Access by Organization'}
				delegates={delegates}
				loading={loadingDelegates}
			/>
			<DelegatesList title={'Your Delegates'} delegates={delegates} loading={loadingDelegates} />
		</MyDataLayout>
	)
})

export default MyDataPage
