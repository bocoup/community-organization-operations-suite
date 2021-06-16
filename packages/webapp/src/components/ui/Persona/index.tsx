/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ContextualMenu, Persona, PersonaSize } from '@fluentui/react'
import cx from 'classnames'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import style from './index.module.scss'
import ComponentProps from '~types/ComponentProps'
import { useAuthUser } from '~hooks/api/useAuth'
import ClientOnly from '~ui/ClientOnly'
import { useRecoilState } from 'recoil'
import { isNotificationsPanelOpenState } from '~store'

export default function CustomPersona({ className }: ComponentProps): JSX.Element {
	const [personaMenuOpen, setPersonaMenuOpen] = useState(false)
	const personaComponent = useRef(null)
	const router = useRouter()
	const { authUser, logout } = useAuthUser()
	const [notificationsOpen, setNotificationsOpen] = useRecoilState(isNotificationsPanelOpenState)

	if (!authUser?.accessToken) return null

	const { first: firstName } = authUser.user.name

	return (
		<div className={className}>
			<div
				onClick={() => setPersonaMenuOpen(true)}
				className={cx(style.persona, 'd-flex align-items-center')}
			>
				{/* TODO: remove stack in favor of styled div component */}
				<div className='d-flex align-items-center justify-content-center'>
					{authUser.user.mentions?.some(m => !m.seen) && (
						<span onClick={() => setNotificationsOpen(true)}>Bell Icon</span>
					)}
					<div className='pr-3 me-3'>Hello, {firstName}</div>
					<ClientOnly>
						<Persona
							ref={personaComponent}
							text={firstName}
							size={PersonaSize.size32}
							hidePersonaDetails
						/>

						<ContextualMenu
							items={[
								{
									key: 'viewAccount',
									text: 'Account',
									onClick: () => router.push('/account')
								},
								{
									key: 'logoutUserPersonaMenu',
									text: 'Logout',
									onClick: () => {
										router.push('/login')
										logout()
									}
								}
							]}
							hidden={!personaMenuOpen}
							target={personaComponent}
							onItemClick={() => setPersonaMenuOpen(false)}
							onDismiss={() => setPersonaMenuOpen(false)}
						/>
					</ClientOnly>
				</div>
			</div>
		</div>
	)
}
