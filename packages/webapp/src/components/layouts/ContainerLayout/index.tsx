/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import DefaultLayout, { DefaultLayoutProps } from '~layouts/Default'
import ActionBar from '~ui/ActionBar'
import CRC from '~ui/CRC'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { isNotificationsPanelOpenState } from '~store'
import RequestPanel from '~ui/RequestPanel'
import { memo, useEffect, useState } from 'react'
import { useAuthUser } from '~hooks/api/useAuth'
import NotificationPanel from '~components/ui/NotificationsPanel'
import SubscribeToMentions from '~ui/SubscribeToMentions'
import ClientOnly from '~ui/ClientOnly'
import styles from './index.module.scss'
import { useOrganization } from '~hooks/api/useOrganization'
import SpecialistPanel from '~ui/SpecialistPanel'

export interface ContainerLayoutProps extends DefaultLayoutProps {
	title?: string
	size?: 'sm' | 'md' | 'lg'
	showTitle?: boolean
	documentTitle?: string
}

const ContainerLayout = memo(function ContainerLayout({
	children,
	title,
	size,
	showTitle = true,
	showNav = true,
	documentTitle
}: ContainerLayoutProps): JSX.Element {
	const router = useRouter()
	const { authUser } = useAuthUser()
	const { engagement, specialist } = router.query
	const [requestOpen, setRequestOpen] = useState(!!engagement)
	const [specialistOpen, setSpecialistOpen] = useState(!!specialist)
	const [notificationsOpen, setNotificationsOpen] = useRecoilState(isNotificationsPanelOpenState)
	const { organization } = useOrganization(authUser?.user?.roles[0]?.orgId)

	useEffect(() => {
		if (Object.keys(router.query).length === 0) {
			setRequestOpen(false)
			setNotificationsOpen(false)
			setSpecialistOpen(false)
		}
	}, [router.query])

	useEffect(() => {
		// If a request is added to the router query after page load open the request panel
		// And close the notification panel
		if (typeof engagement === 'string') {
			setRequestOpen(true)
			setSpecialistOpen(false)
			setNotificationsOpen(false)
		}

		if (typeof specialist === 'string') {
			setSpecialistOpen(true)
			setRequestOpen(false)
			setNotificationsOpen(false)
		}
	}, [setRequestOpen, engagement, setNotificationsOpen, setSpecialistOpen, specialist])

	return (
		<>
			<DefaultLayout showNav={showNav} title={documentTitle}>
				<ClientOnly className={styles.actionBar}>
					<ActionBar
						showNav={showNav}
						showTitle={showTitle}
						title={organization?.name}
						showPersona
						showNotifications
					/>
				</ClientOnly>

				{/* Request panel here */}
				<RequestPanel
					openPanel={requestOpen}
					onDismiss={() => {
						router.push(router.pathname)
						setRequestOpen(false)
					}}
					request={engagement ? { id: engagement as string, orgId: organization?.id } : undefined}
				/>

				<NotificationPanel
					openPanel={notificationsOpen}
					onDismiss={() => setNotificationsOpen(false)}
				/>

				<SpecialistPanel
					openPanel={specialistOpen}
					onDismiss={() => {
						router.push(router.pathname, undefined, { shallow: true })
						setSpecialistOpen(false)
					}}
					specialistId={specialist ? (specialist as string) : undefined}
				/>

				<CRC size={size} className={styles.content}>
					<>
						{authUser?.accessToken && (
							<ClientOnly>
								<SubscribeToMentions />
							</ClientOnly>
						)}

						{title && <h1 className='mt-5'>{title}</h1>}

						{authUser?.accessToken && children}
					</>
				</CRC>
			</DefaultLayout>
		</>
	)
})
export default ContainerLayout
