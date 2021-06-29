/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import ClientOnly from '~ui/ClientOnly'
import { memo } from 'react'
import { useTranslation } from 'next-i18next'

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
	const { t } = useTranslation('common')

	const topNav = [
		{
			link: '/',
			label: t('mainNavigation.requests.text')
		},
		{
			link: '/specialist',
			label: t('mainNavigation.specialists.text')
		},
		{
			link: '/clients',
			label: t('mainNavigation.clients.text')
		},
		{
			link: '/requestTags',
			label: t('mainNavigation.requestTags.text')
		},
		{
			link: '/attributes',
			label: t('mainNavigation.attributes.text')
		}
	]

	return (
		<ClientOnly>
			<nav className={cx(styles.topNav, 'd-flex justify-content-between')}>
				{topNav.map(navItem => (
					<NavItem
						{...navItem}
						key={`top-nav-${navItem.label}`}
						active={router.pathname === navItem.link}
					/>
				))}
			</nav>
		</ClientOnly>
	)
})
export default TopNav
