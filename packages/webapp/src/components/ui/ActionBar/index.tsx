/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Link } from '@fluentui/react'
import cx from 'classnames'
import { isValidElement, memo } from 'react'
import styles from './index.module.scss'
import { useWindowSize } from '~hooks/useWindowSize'
import type { StandardFC } from '~types/StandardFC'
import { ContainerRowColumn as CRC } from '~ui/CRC'
import { PersonalNav } from '~ui/PersonalNav'
import { TopNav } from '~ui/TopNav'
import { Notifications } from '~ui/Notifications'
import { LanguageDropdown } from '../LanguageDropdown'
import { useTranslation } from '~hooks/useTranslation'

export interface ActionBarProps {
	showNav?: boolean
	showTitle?: boolean
	showPersona?: boolean
	showNotifications?: boolean
	title?: string | JSX.Element
	size?: 'sm' | 'md' | 'lg'
}

/**
 * Top Level action bar
 */
export const ActionBar: StandardFC<ActionBarProps> = memo(function ActionBar({
	children,
	showNav = false,
	showTitle = false,
	showPersona = false,
	showNotifications = false,
	size,
	title
}) {
	const { isLG } = useWindowSize()
	const { c } = useTranslation()

	return (
		<div
			className={cx(
				'd-flex justify-content-between align-items-center py-3 bg-primary-dark text-light',
				styles.actionBar
			)}
		>
			<CRC size={size}>
				<div className='d-flex justify-content-between align-items-center'>
					<div className='d-flex align-items-center'>
						{showTitle && title ? (
							isValidElement(title) && title
						) : (
							<strong className={cx('text-light', styles.actionBarTitle)}>{c('app.title')}</strong>
						)}

						{showTitle && typeof title === 'string' && (
							<Link href='/' className={cx('text-light', styles.actionBarTitle)}>
								<strong>{title}</strong>
							</Link>
						)}

						{isLG && showNav && <TopNav />}

						{children}
					</div>
					<div className='d-flex justify-content-between align-items-center'>
						<LanguageDropdown />
						{showNotifications && <Notifications />}
						{showPersona && <PersonalNav />}
					</div>
				</div>
			</CRC>
		</div>
	)
})
