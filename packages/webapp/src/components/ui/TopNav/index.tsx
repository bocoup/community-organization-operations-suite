/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import { Link } from '@fluentui/react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import ClientOnly from '~ui/ClientOnly'
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
		<Link href={link} className={cx('text-light', styles.navItem, active && styles.navItemActive)}>
			{label}
		</Link>
	)
}

const TopNav = memo(function TopNav(): JSX.Element {
	const { c } = useTranslation()
	const location = useLocation()

	const topNav = [
		{
			link: '/',
			label: c('mainNavigation.requestsText')
		},
		{
			link: '/services',
			label: c('mainNavigation.servicesText')
		},
		{
			link: '/specialist',
			label: c('mainNavigation.specialistsText')
		},
		{
			link: '/clients',
			label: c('mainNavigation.clientsText')
		},
		{
			link: '/tags',
			label: c('mainNavigation.tagsText')
		},
		{
			link: '/reporting',
			label: c('mainNavigation.reportingText')
		}
	]

	return (
		<ClientOnly>
			<nav className={cx(styles.topNav, 'd-flex justify-content-between')}>
				{topNav.map((navItem, idx) => (
					<NavItem
						{...navItem}
						key={`top-nav-${navItem.link}`}
						active={location.pathname === navItem.link}
					/>
				))}
			</nav>
		</ClientOnly>
	)
})
export default TopNav
