/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { Link, useLocation } from 'react-router-dom'

export const TopNav = memo(function TopNav() {
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
		<nav className={styles.topNav}>
			{topNav.map((navItem, idx) => {
				const { label, link } = navItem
				const active = location.pathname === link ? 'nav-active' : null

				return (
					<Link key={idx} to={link} className={active}>
						{label}
					</Link>
				)
			})}
		</nav>
	)
})
