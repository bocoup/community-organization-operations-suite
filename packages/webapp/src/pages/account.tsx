/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ProfileForm } from '~forms/ProfileForm'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { wrap } from '~utils/appinsights'
import { Title } from '~components/ui/Title'

const AccountPage = wrap(function AccountPage() {
	const { t } = useTranslation(Namespace.Account)
	const { currentUser } = useCurrentUser()
	const title = t('pageTitle')
	return (
		<>
			<Title title={title} />
			<ProfileForm user={currentUser} />
		</>
	)
})

export default AccountPage
