/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { FC, memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { Link, useLocation } from 'react-router-dom'

interface NavItemProps extends ComponentProps {
	link: string
	label: string
	active: boolean
	className: string
}

const NavItem: FC<NavItemProps> = memo(function NavItem({ link, label, active, className }) {
	return (
		<Link
			to={link}
			className={cx('text-light', className, styles.navItem, active && styles.navItemActive)}
		>
			{label}
		</Link>
	)
})

const TopNav = memo(function TopNav(): JSX.Element {
	const { c } = useTranslation()
	const location = useLocation()

	const topNav = [
		{
			link: '/',
			className: 'topNavDashboard',
			label: c('mainNavigation.requestsText')
		},
		{
			link: '/services',
			className: 'topNavServices',
			label: c('mainNavigation.servicesText')
		},
		{
			link: '/specialist',
			className: 'topNavSpecialists',
			label: c('mainNavigation.specialistsText')
		},
		{
			link: '/clients',
			className: 'topNavClients',
			label: c('mainNavigation.clientsText')
		},
		{
			link: '/tags',
			className: 'topNavTags',
			label: c('mainNavigation.tagsText')
		},
		{
			link: '/reporting',
			className: 'topNavReporting',
			label: c('mainNavigation.reportingText')
		}
	]

	return (
		<nav className={cx(styles.topNav, 'd-flex justify-content-between')}>
			{topNav.map((navItem, idx) => (
				<NavItem
					{...navItem}
					key={`top-nav-${navItem.link}`}
					active={location.pathname === navItem.link}
				/>
			))}
		</nav>
	)
})
export default TopNav
