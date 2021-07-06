/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import { useAuthUser } from '~hooks/api/useAuth'
import { useOrganization } from '~hooks/api/useOrganization'
import { get } from 'lodash'
import ProfileForm from '~forms/ProfileForm'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import getServerSideTranslations from '~utils/getServerSideTranslations'

export const getStaticProps = getServerSideTranslations(['account'])

const AccountPage = memo(function AccountPage(): JSX.Element {
	const { t } = useTranslation('account')
	const { authUser } = useAuthUser()
	const userRole = get(authUser, 'user.roles[0]')
	const { data: orgData } = useOrganization(userRole?.orgId)
	const user = orgData?.users?.find(u => u.id === authUser?.user?.id)

	return (
		<ContainerLayout orgName={orgData?.name} documentTitle={t('page.title')}>
			<ProfileForm user={user} />
		</ContainerLayout>
	)
})
export default AccountPage
