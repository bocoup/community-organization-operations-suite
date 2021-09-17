/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import ContainerLayout from '~layouts/ContainerLayout'
import { memo, useRef } from 'react'
import ServiceList from '~components/lists/ServiceList'
import { useServiceList } from '~hooks/api/useServiceList'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useTranslation } from '~hooks/useTranslation'
import { Service, ServiceInput, ServiceStatus } from '@cbosuite/schema/dist/client-types'
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog'
import { useBoolean } from '@fluentui/react-hooks'
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button'

const Services = memo(function Services(): JSX.Element {
	const { orgId } = useCurrentUser()
	const { t } = useTranslation('services')
	const { serviceList, loading, updateService } = useServiceList(orgId)
	const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true)
	const serviceInput = useRef(null)

	const handleServiceClose = (values: Service) => {
		const updatedService: ServiceInput = {
			serviceId: values.id,
			name: values.name,
			contactFormEnabled: values.contactFormEnabled,
			orgId: orgId,
			serviceStatus: ServiceStatus.Archive
		}
		serviceInput.current = updatedService
		toggleHideDialog()
	}

	const archiveService = async () => {
		await updateService(serviceInput.current)
		serviceInput.current = null
		toggleHideDialog()
	}

	const serviceName = serviceInput.current ? serviceInput.current.name : ''

	return (
		<ContainerLayout documentTitle={t('pageTitle')}>
			<ServiceList
				title={t('pageTitle')}
				services={serviceList.filter((s) => s.serviceStatus !== ServiceStatus.Archive)}
				loading={loading}
				onServiceClose={handleServiceClose}
			/>
			<Dialog
				hidden={hideDialog}
				onDismiss={toggleHideDialog}
				dialogContentProps={{
					type: DialogType.normal,
					title: t('archiveModal.title'),
					closeButtonAriaLabel: t('archiveModal.close'),
					subText: t('archiveModal.subText', { serviceName })
				}}
				modalProps={{
					isBlocking: false,
					styles: { main: { maxWidth: 450 } }
				}}
			>
				<DialogFooter>
					<PrimaryButton onClick={archiveService} text={t('archiveModal.title')} />
					<DefaultButton onClick={toggleHideDialog} text={t('archiveModal.cancel')} />
				</DialogFooter>
			</Dialog>
		</ContainerLayout>
	)
})
export default Services
