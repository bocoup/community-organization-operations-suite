/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Link, Panel as FluentPanel, PanelType } from '@fluentui/react'
import Icon from '~ui/Icon'

import { useBoolean } from '@fluentui/react-hooks'
import type ComponentProps from '~types/ComponentProps'
import cx from 'classnames'
import styles from './index.module.scss'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { useLocation } from 'react-router-dom'

interface NavItemProps extends ComponentProps {
	link: string
	label: string
	active: boolean
}

const NavItem = ({ link, label, active }: NavItemProps): JSX.Element => {
	return (
		<Link href={link} className={cx(styles.navItem, active && styles.navItemActive)}>
			{label}
		</Link>
	)
}

const MobileMenu = memo(function MobileMenu(): JSX.Element {
	const location = useLocation()
	const [isNavOpen, { setTrue: openNavPanel, setFalse: dismissNavPanel }] = useBoolean(false)
	const { c } = useTranslation()

	const topNav = [
		{
			link: '/',
			label: c('mobileMenu.homePageLabel')
		},
		{
			link: '/services',
			label: c('mobileMenu.servicesLabel')
		},
		{
			link: '/specialist',
			label: c('mobileMenu.specialistPageLabel')
		},
		{
			link: '/clients',
			label: c('mobileMenu.clientsPageLabel')
		},
		{
			link: '/tags',
			label: c('mobileMenu.tagsPageLabel')
		},
		{
			link: '/reporting',
			label: c('mobileMenu.reportingPageLabel')
		}
	]

	return (
		<>
			<Icon className='text-light' iconName='GlobalNavButton' onClick={() => openNavPanel()} />
			<FluentPanel
				isLightDismiss
				isOpen={isNavOpen}
				type={PanelType.custom}
				customWidth='200px'
				closeButtonAriaLabel={c('panelActions.closeAriaLabel')}
				onDismiss={() => dismissNavPanel()}
				styles={{
					main: {
						marginTop: 56
					},
					overlay: {
						marginTop: 56
					},
					scrollableContent: {
						overflow: 'visible'
					},
					content: {
						overflow: 'visible'
					}
				}}
			>
				<nav className={cx(styles.mobileNav)}>
					{topNav.map((navItem) => (
						<NavItem
							{...navItem}
							key={`mobile-nav-${navItem.label}`}
							active={location.pathname === navItem.link}
						/>
					))}
				</nav>
			</FluentPanel>
		</>
	)
})
export default MobileMenu
