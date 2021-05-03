import Link from 'next/link'
import type CP from '~types/ComponentProps'
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

export default function NavBar({}: CP): JSX.Element {
	return (
		<div className={'d-flex justify-content-between align-items-center pt-5'}>
			<CRC>
				<div className='d-flex justify-content-between align-items-center'>
					{links.map((link, i) => (
						<Link href={link.link} key={`navbar-link-${i}`}>
							<a className=''>{link.label}</a>
						</Link>
					))}
				</div>
			</CRC>
		</div>
	)
}
