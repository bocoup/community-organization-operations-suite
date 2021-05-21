/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Layout from '~components/layouts/ContainerLayout'
import { useAuthUser } from '~hooks/api/useAuth'

export default function AccountPage(): JSX.Element {
	const { authUser } = useAuthUser()
	const { first: firstName, last: lastName } = authUser.user?.name || {}

	return (
		<Layout title='Account Info'>
			<p>
				name: {firstName} {lastName}
			</p>
			<p>Roles:</p>
			<ul>
				{authUser.user.roles.map((role, idx) => {
					return <li key={idx}>{role.roleType}</li>
				})}
			</ul>
		</Layout>
	)
}
