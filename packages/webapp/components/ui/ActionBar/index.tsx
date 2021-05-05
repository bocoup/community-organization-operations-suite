/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import Link from 'next/link'
import styles from './index.module.scss'
import useWindowSize from '~hooks/useWindowSize'
import type CP from '~types/ComponentProps'
import CRC from '~ui/CRC'
import PersonalNav from '~ui/PersonalNav'
import TopNav from '~ui/TopNav'

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
						<span className='text-light'>
							<strong>CBO Name Here</strong>
						</span>
					</Link>

					{isLG && showNav && <TopNav />}

					{children}

					<PersonalNav />
				</div>
			</CRC>
		</div>
	)
}
