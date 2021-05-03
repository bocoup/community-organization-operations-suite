import cx from 'classnames'
import Link from 'next/link'
import useWindowSize from '~hooks/useWindowSize'
import type CP from '~types/ComponentProps'
import CRC from '~ui/CRC'
import PersonalNav from '~ui/PersonalNav'
import TopNav from '~ui/TopNav'
import styles from './index.module.scss'

export interface ActionBarProps extends CP {
	showNav: boolean
}

/**
 * Top Level action bar
 */
export default function ActionBar({ children, showNav = true }: ActionBarProps): JSX.Element {
	const { isLG } = useWindowSize()

	return (
		<div
			className={cx(
				'd-flex justify-content-between align-items-center py-3 bg-primary text-light',
				styles.actionBar
			)}
		>
			<CRC>
				<div className='d-flex justify-content-between align-items-center'>
					<Link href='/'>
						<a className='text-light'>
							<strong>CBO Name Here</strong>
						</a>
					</Link>

					{isLG && showNav && <TopNav />}

					{children}

					<PersonalNav />
				</div>
			</CRC>
		</div>
	)
}
