/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useAuthUser } from '~hooks/api/useAuth'
import ContainerLayout from '~layouts/ContainerLayout'
import { get } from 'lodash'
import ContactList from '~lists/ContactList'
import { useOrganization } from '~hooks/api/useOrganization'
import { memo } from 'react'

const Home = memo(function Home(): JSX.Element {
	const { authUser } = useAuthUser()
	const userRole = get(authUser, 'user.roles[0]')
	const { data: orgData } = useOrganization(userRole?.orgId)

	return (
		<ContainerLayout orgName={orgData?.name}>
			{authUser?.accessToken && <ContactList title='Clients' />}
		</ContainerLayout>
	)
})
export default Home
