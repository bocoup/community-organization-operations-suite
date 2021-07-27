/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import MyDataLayout from '~components/layouts/MyDataLayout'
import ContactDataAccessPref from '~components/lists/ContactDataAccessPref'
import getServerSideTranslations from '~utils/getServerSideTranslations'
import { useCurrentUser } from '~hooks/api/useCurrentuser'
import { Contact } from '@resolve/schema/lib/client-types'

export const getStaticProps = getServerSideTranslations(['common', 'footer'])

const MyDataAccessPreferences = memo(function MyDataAccessPreferences(): JSX.Element {
	const { currentUser } = useCurrentUser() as { currentUser: Contact }

	const accessPrefs = [
		{
			dataType: 'Real Name',
			currentInformation: `${currentUser?.name.first} ${currentUser?.name.last}`,
			permission: 'Accept All',
			lastRequested: new Date('2021-07-26T00:00:00.000Z').toLocaleDateString()
		},
		{
			dataType: 'Home Address',
			currentInformation: `${currentUser?.address?.unit} ${currentUser?.address?.street} ${currentUser?.address?.city} ${currentUser?.address?.state} ${currentUser?.address?.zip}`,
			permission: 'Accept All',
			lastRequested: new Date('2021-07-26T00:00:00.000Z').toLocaleDateString()
		},
		{
			dataType: 'Phone Number',
			currentInformation: `${currentUser?.phone || ''}`,
			permission: 'Accept All',
			lastRequested: new Date('2021-07-26T00:00:00.000Z').toLocaleDateString()
		},
		{
			dataType: 'Email Address',
			currentInformation: `${currentUser?.email}`,
			permission: 'Accept All',
			lastRequested: new Date('2021-07-26T00:00:00.000Z').toLocaleDateString()
		},
		{
			dataType: 'Date of Birth',
			currentInformation: `${currentUser?.dateOfBirth}`,
			permission: 'Accept All',
			lastRequested: new Date('2021-07-26T00:00:00.000Z').toLocaleDateString()
		}
	]

	return (
		<MyDataLayout documentTitle={'Manage My Data'}>
			<ContactDataAccessPref
				title={'Manage Access to Your Data'}
				accessPreferences={accessPrefs}
				loading={false}
			/>
		</MyDataLayout>
	)
})

export default MyDataAccessPreferences
