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
import { useTranslation } from 'next-i18next'
import getServerSideTranslations from '~utils/getServerSideTranslations'

export const getStaticProps = getServerSideTranslations(['clients'])

const Clients = memo(function Clients(): JSX.Element {
	const { t } = useTranslation('clients')
	const { authUser } = useAuthUser()
	const userRole = get(authUser, 'user.roles[0]')
	const { data: orgData } = useOrganization(userRole?.orgId)

	return (
		<ContainerLayout orgName={orgData?.name} documentTitle={t('page.title')}>
			{authUser?.accessToken && <ContactList title={t('clients.title')} />}
		</ContainerLayout>
	)
})

export default Clients
