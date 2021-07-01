/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useAuthUser } from '~hooks/api/useAuth'
import ContainerLayout from '~layouts/ContainerLayout'
import { get } from 'lodash'
import { useOrganization } from '~hooks/api/useOrganization'
import AttributesList from '~components/lists/AttributesList'
import { memo } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next'
import { useTranslation } from 'next-i18next'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale, ['common', 'footer', 'attributes']))
		}
	}
}

const Attributes = memo(function Attributes(): JSX.Element {
	const { t } = useTranslation('attributes')
	const { authUser } = useAuthUser()
	const userRole = get(authUser, 'user.roles[0]')
	const { data: orgData } = useOrganization(userRole?.orgId)

	return (
		<ContainerLayout orgName={orgData?.name} documentTitle={t('page.title')}>
			{authUser?.accessToken && <AttributesList title={t('attributes.title')} />}
		</ContainerLayout>
	)
})

export default Attributes
