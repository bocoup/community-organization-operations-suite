/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import { useAuthUser } from '~hooks/api/useAuth'
import ProfileForm from '~forms/ProfileForm'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import getServerSideTranslations from '~utils/getServerSideTranslations'
import ClientOnly from '~ui/ClientOnly'

export const getStaticProps = getServerSideTranslations(['account'])

const AccountPage = memo(function AccountPage(): JSX.Element {
	const { t } = useTranslation('account')
	const { authUser } = useAuthUser()

	return (
		<ContainerLayout documentTitle={t('page.title')}>
			<ClientOnly>
				<ProfileForm user={authUser?.user} />
			</ClientOnly>
		</ContainerLayout>
	)
})
export default AccountPage
