/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Icon from '~ui/Icon'
import cx from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { isValidElement, useCallback } from 'react'
import { Button } from 'react-bootstrap'
import styles from './index.module.scss'
import useWindowSize from '~hooks/useWindowSize'
import type CP from '~types/ComponentProps'
import CRC from '~ui/CRC'
import PersonalNav from '~ui/PersonalNav'
import TopNav from '~ui/TopNav'
import Notifications from '~ui/Notifications'

export interface ActionBarProps extends CP {
	showNav?: boolean
	showBack?: boolean
	showTitle?: boolean
	showPersona?: boolean
	showNotifications?: boolean
	title?: string | JSX.Element
	size?: 'sm' | 'md' | 'lg'
	onBack?: () => void
}

/**
 * Top Level action bar
 */
export default function ActionBar({
	children,
	showNav = false,
	showBack = false,
	showTitle = false,
	showPersona = false,
	showNotifications = false,
	size,
	onBack,
	title = 'Greenlight'
}: ActionBarProps): JSX.Element {
	const { isLG } = useWindowSize()
	const router = useRouter()
	const handleBackClick = useCallback(() => {
		if (onBack) {
			onBack()
		} else {
			router.back()
		}
	}, [router, onBack])

	return (
		<div
			className={cx(
				'd-flex justify-content-between align-items-center py-3 bg-primary text-light',
				styles.actionBar
			)}
		>
			<CRC size={size}>
				<div className='d-flex justify-content-between align-items-center'>
					<div className='d-flex align-items-center'>
						{/* TODO: Get back from translations */}
						{showBack && (
							<Button
								className='btn-link text-light d-flex align-items-center text-decoration-none ps-0 pointer'
								onClick={handleBackClick}
							>
								<Icon className='me-2' iconName='ChevronLeft' /> Back
							</Button>
						)}

						{showTitle && isValidElement(title) && title}

						{showTitle && typeof title === 'string' && (
							<Link href='/'>
								<a className={cx('text-light', styles.actionBarTitle)}>
									<strong>{title}</strong>
								</a>
							</Link>
						)}

						{isLG && showNav && <TopNav />}

						{children}
					</div>
					<div className='d-flex justify-content-between align-items-center'>
						{showNotifications && <Notifications />}
						{showPersona && <PersonalNav />}
					</div>
				</div>
			</CRC>
		</div>
	)
}
