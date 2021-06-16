/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import DefaultLayout, { DefaultLayoutProps } from '~layouts/Default'
import ActionBar from '~ui/ActionBar'
import CRC from '~ui/CRC'
import qs from 'querystring'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { isNotificationsPanelOpenState } from '~store'
import RequestPanel from '~ui/RequestPanel'
import { useEffect, useState } from 'react'
import { useAuthUser } from '~hooks/api/useAuth'
import { useOrganization } from '~hooks/api/useOrganization2'
import NotificationPanel from '~components/ui/NotificationsPanel'
import { Engagement } from '@greenlight/schema/lib/client-types'
export interface ContainerLayoutProps extends DefaultLayoutProps {
	title?: string
	size?: 'sm' | 'md' | 'lg'
	showTitle?: boolean
	orgName?: string
}

export default function ContainerLayout({
	children,
	title,
	size,
	showTitle = true,
	showNav = true,
	orgName
}: ContainerLayoutProps): JSX.Element {
	const router = useRouter()
	const { authUser } = useAuthUser()
	const { organization } = useOrganization()
	const { engagement } = router.query
	const [requestOpen, setRequestOpen] = useState(!!engagement)
	const [notificationsOpen, setNotificationsOpen] = useRecoilState(isNotificationsPanelOpenState)

	useEffect(() => {
		// If a request is added to the router query after page load open the request panel
		// And close the notification panel
		if (typeof engagement === 'string') {
			setNotificationsOpen(false)
			setRequestOpen(true)
		}
	}, [requestOpen, setRequestOpen, engagement])

	return (
		<>
			<DefaultLayout showNav={showNav}>
				<ActionBar
					showNav={showNav}
					showTitle={showTitle}
					title={orgName}
					showPersona
					showNotifications
				/>

				{/* Request panel here */}
				<RequestPanel
					openPanel={requestOpen}
					onDismiss={() => router.push(router.pathname)}
					request={engagement ? { id: engagement as string, orgId: organization?.id } : undefined}
				/>

				<NotificationPanel
					openPanel={notificationsOpen}
					onDismiss={() => setNotificationsOpen(false)}
				/>

				<CRC size={size}>
					<>
						{title && <h1 className='mt-5'>{title}</h1>}

						{children}
					</>
				</CRC>
			</DefaultLayout>
		</>
	)
}
