/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ProfileForm } from '~forms/ProfileForm'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { wrap } from '~utils/appinsights'
import { Title } from '~components/ui/Title'

const AccountPage = wrap(
	memo(function AccountPage(): JSX.Element {
		const { t } = useTranslation('account')
		const { currentUser } = useCurrentUser()
		const title = t('pageTitle')
		return (
			<>
				<Title title={title} />
				<ProfileForm user={currentUser} />
			</>
		)
	})
)
export default AccountPage
