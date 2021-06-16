/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useAuthUser } from '~hooks/api/useAuth'
import ContainerLayout from '~layouts/ContainerLayout'
import { get } from 'lodash'
import ContactList from '~lists/ContactList'

export default function Home(): JSX.Element {
	// const { authUser } = useAuthUser()
	// const userRole = get(authUser, 'user.roles[0]')
	// const { data: contacts } = useContacts()

	return (
		<ContainerLayout orgName={undefined}>
			{/* {authUser?.accessToken && <SpecialistList title='Specialists' />} */}
			<div>
				<ContactList />
			</div>
		</ContainerLayout>
	)
}
