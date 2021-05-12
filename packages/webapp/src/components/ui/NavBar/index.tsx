/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Link from 'next/link'
import CRC from '~ui/CRC'

const links = [
	{
		link: '/',
		label: 'Home'
	},
	{
		link: '/requests',
		label: 'Requests'
	},
	{
		link: '/directory',
		label: 'Directory'
	},
	{
		link: '/notifications',
		label: 'Notifications'
	},
	{
		link: '/about',
		label: 'About'
	}
]

export default function NavBar(): JSX.Element {
	return (
		<div className={'d-flex justify-content-between align-items-center pt-5'}>
			<CRC>
				<div className='d-flex justify-content-between align-items-center'>
					{links.map((link, i) => (
						<Link href={link.link} key={`navbar-link-${i}`}>
							<span className=''>{link.label}</span>
						</Link>
					))}
				</div>
			</CRC>
		</div>
	)
}
