/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import ContactList from '~lists/ContactList'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import getServerSideTranslations from '~utils/getServerSideTranslations'

export const getStaticProps = getServerSideTranslations(['clients'])

const Clients = memo(function Clients(): JSX.Element {
	const { t } = useTranslation('clients')

	return (
		<ContainerLayout documentTitle={t('page.title')}>
			<ContactList title={t('clients.title')} />
		</ContainerLayout>
	)
})

export default Clients
