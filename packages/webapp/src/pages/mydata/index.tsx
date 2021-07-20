/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useEffect, useState } from 'react'
import MyDataLayout from '~components/layouts/MyDataLayout'
import DelegatesList from '~components/lists/DelegatesList'
import getServerSideTranslations from '~utils/getServerSideTranslations'
import { useCurrentUser } from '~hooks/api/useCurrentuser'
import { Contact } from '@resolve/schema/lib/client-types'

export const getStaticProps = getServerSideTranslations(['common', 'footer'])

const MyDataPage = memo(function MyDataPage(): JSX.Element {
	const { currentUser } = useCurrentUser()
	const [delegates, setDelegates] = useState<any[]>([])

	useEffect(() => {
		const contact = currentUser as Contact
		if (contact?.engagements.length > 0) {
			setDelegates(contact.engagements)
		}
	}, [currentUser])

	return (
		<MyDataLayout documentTitle={'Manage My Data'}>
			<DelegatesList title={'Your Delegates'} delegates={delegates} />
		</MyDataLayout>
	)
})

export default MyDataPage
