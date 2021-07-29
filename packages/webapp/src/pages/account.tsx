/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import ProfileForm from '~forms/ProfileForm'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import getServerSideTranslations from '~utils/getServerSideTranslations'
import ClientOnly from '~ui/ClientOnly'
import { useCurrentUser } from '~hooks/api/useCurrentUser'

export const getStaticProps = getServerSideTranslations(['account'])

const AccountPage = memo(function AccountPage(): JSX.Element {
	const { t } = useTranslation('account')
	const { currentUser } = useCurrentUser()

	return (
		<ContainerLayout documentTitle={t('page.title')}>
			<ClientOnly>
				<ProfileForm user={currentUser} />
			</ClientOnly>
		</ContainerLayout>
	)
})
export default AccountPage
