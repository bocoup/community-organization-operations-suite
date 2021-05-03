/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import Link from 'next/link'
import type ComponentProps from '~types/ComponentProps'
import styles from './index.module.scss'

interface TopNavProps extends ComponentProps {
	title?: string
}

interface NavItemProps extends ComponentProps {
	link: string
	label: string
}

const NavItem = ({ link, label }: NavItemProps): JSX.Element => {
	return (
		<Link href={link}>
			<a className='text-light'>{label}</a>
		</Link>
	)
}

export default function TopNav({}: TopNavProps): JSX.Element {
	const topNav = [
		{
			link: '/',
			label: 'Dashboard'
		},
		{
			link: '/reporting',
			label: 'Reporting'
		},
		{
			link: '/directory',
			label: 'Directory'
		}
	]

	return (
		<>
			<nav className={cx(styles.topNav, 'd-flex justify-content-between')}>
				{topNav.map(navItem => (
					<NavItem {...navItem} key={`top-nav-${navItem.label}`} />
				))}
			</nav>
		</>
	)
}
