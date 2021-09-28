/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { Link, useLocation } from 'react-router-dom'

interface NavItemProps extends ComponentProps {
	link: string
	label: string
	active: boolean
}

const NavItem = ({ link, label, active }: NavItemProps): JSX.Element => {
	return (
		<Link to={link} className={cx('text-light', styles.navItem, active && styles.navItemActive)}>
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
