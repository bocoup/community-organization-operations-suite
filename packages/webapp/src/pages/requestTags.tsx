/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useAuthUser } from '~hooks/api/useAuth'
import ContainerLayout from '~layouts/ContainerLayout'
import { get } from 'lodash'
import { useOrganization } from '~hooks/api/useOrganization'
import RequestTagsList from '~components/lists/RequestTagsList'
import { memo } from 'react'
import { useTranslation } from 'next-i18next'
import getServerSideTranslations from '~utils/getServerSideTranslations'

export const getStaticProps = getServerSideTranslations(['requestTags'])

const RequestTags = memo(function RequestTags(): JSX.Element {
	const { t } = useTranslation('requestTags')
	const { authUser } = useAuthUser()
	const userRole = get(authUser, 'user.roles[0]')
	const { data: orgData } = useOrganization(userRole?.orgId)

	return (
		<ContainerLayout orgName={orgData?.name} documentTitle={t('page.title')}>
			{authUser?.accessToken && <RequestTagsList title={t('requestTags.title')} />}
		</ContainerLayout>
	)
})

export default RequestTags
