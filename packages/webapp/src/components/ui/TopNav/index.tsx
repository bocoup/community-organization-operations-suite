/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import { Link } from '@fluentui/react'
import { useRouter } from 'next/router'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import ClientOnly from '~ui/ClientOnly'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'

interface NavItemProps extends ComponentProps {
	link: string
	label: string
	active: boolean
}

const NavItem = ({ link, label, active }: NavItemProps): JSX.Element => {
	return (
		<Link href={link}>
			<a className={cx('text-light', styles.navItem, active && styles.navItemActive)}>{label}</a>
		</Link>
	)
}

const TopNav = memo(function TopNav(): JSX.Element {
	const router = useRouter()
	const { c } = useTranslation()

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
						active={router.pathname === navItem.link}
					/>
				))}
			</nav>
		</ClientOnly>
	)
})
export default TopNav
