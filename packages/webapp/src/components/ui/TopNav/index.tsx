/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'

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

export default function TopNav(): JSX.Element {
	const router = useRouter()

	const topNav = [
		{
			link: '/',
			label: 'Requests'
		},
		{
			link: '/specialist',
			label: 'Specialists'
		},
		{
			link: '/clients',
			label: 'Clients'
		},
		{
			link: '/requestTags',
			label: 'Request Tags'
		},
		{
			link: '/attributes',
			label: 'Attributes'
		}
	]
	console.log('router', router)

	return (
		<>
			<nav className={cx(styles.topNav, 'd-flex justify-content-between')}>
				{topNav.map(navItem => (
					<NavItem
						{...navItem}
						key={`top-nav-${navItem.label}`}
						active={router.pathname === navItem.link}
					/>
				))}
			</nav>
		</>
	)
}
