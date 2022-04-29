/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ContextualMenu, Persona as FluentPersona, PersonaSize } from '@fluentui/react'
import cx from 'classnames'
import { memo, useRef, useState } from 'react'
import style from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { useAuthUser } from '~hooks/api/useAuth'
import { useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useNavCallback } from '~hooks/useNavCallback'
import { ApplicationRoute } from '~types/ApplicationRoute'
import { useWindowSize } from '~hooks/useWindowSize'
import { config } from '~utils/config'
import { isOfflineState } from '~store'
import { useRecoilState } from 'recoil'

export const Persona: StandardFC = memo(function Persona({ className }) {
	const [personaMenuOpen, setPersonaMenuOpen] = useState(false)
	const [isOffline] = useRecoilState(isOfflineState)
	const personaComponent = useRef(null)
	const { logout } = useAuthUser()
	const { currentUser } = useCurrentUser()
	const { isLG } = useWindowSize()
	const { c } = useTranslation()
	const firstName = currentUser?.name?.first || ''
	const lastName = currentUser?.name?.last || ''
	const onAccountClick = useNavCallback(ApplicationRoute.Account)
	const onLogoutClick = useNavCallback(ApplicationRoute.Logout)
	const [, setIsOffline] = useRecoilState(isOfflineState)

	const contextMenuItems = [
		{
			key: 'viewAccount',
			text: c('personaMenu.accountText'),
			className: 'view-account',
			onClick: onAccountClick
		},
		{
			key: 'logoutUserPersonaMenu',
			text: c('personaMenu.logoutText'),
			className: 'logout',
			onClick: () => {
				logout()
				onLogoutClick()
			}
		}
	]

	if (config.origin.includes('local')) {
		contextMenuItems.push({
			key: 'divider',
			text: '-',
			className: 'divider',
			onClick: () => {}
		})

		contextMenuItems.push({
			key: 'toggleOffline',
			text: `${isOffline ? 'Disable' : 'Enable'} Offline Mode`,
			className: 'toggle-offline',
			onClick: () => {
				setIsOffline(!isOffline)
			}
		})
	}

	return (
		<div className={className}>
			<div
				onClick={() => setPersonaMenuOpen(true)}
				className={cx(style.persona, 'personaMenuContainer')}
			>
				{/* TODO: remove stack in favor of styled div component */}
				<div className='d-flex align-items-center justify-content-center'>
					{isLG && (
						<div className={style.userName} title={`${firstName} ${lastName}`}>
							{firstName}
						</div>
					)}
					<>
						<FluentPersona
							ref={personaComponent}
							text={firstName}
							size={PersonaSize.size32}
							hidePersonaDetails
						/>

						<ContextualMenu
							items={contextMenuItems}
							hidden={!personaMenuOpen}
							target={personaComponent}
							onItemClick={() => setPersonaMenuOpen(false)}
							onDismiss={() => setPersonaMenuOpen(false)}
						/>
					</>
				</div>
			</div>
		</div>
	)
})
