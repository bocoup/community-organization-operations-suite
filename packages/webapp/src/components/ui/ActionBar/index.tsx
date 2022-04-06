/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Link } from '@fluentui/react'
import cx from 'classnames'
import { memo } from 'react'
import { isEmpty } from 'lodash'
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
	title: string
}

/**
 * Top Level action bar
 */
export const ActionBar: StandardFC<ActionBarProps> = memo(function ActionBar({ title }) {
	const { isLG } = useWindowSize()
	const { c } = useTranslation()

	const showEnvironmentInfo = 'show-environment-info'
	function hideEnvironmentInfo(event: Event) {
		// We are only interested on the header
		const header = (event?.target as HTMLElement)?.closest('header')
		if (header && header.classList.contains(showEnvironmentInfo)) {
			// If the click was below the header, it was on the pseudo-element
			if (event.pageY > header.offsetHeight) {
				header.classList.remove(showEnvironmentInfo)
			}
		}
	}

	return (
		<header className={cx(styles.actionBar, showEnvironmentInfo)} onClick={hideEnvironmentInfo}>
			<CRC>
				<div className='d-flex justify-content-between align-items-center'>
					<div className='d-flex align-items-center'>
						<Link href='/' className={styles.actionBarTitle}>
							{isEmpty(title) ? c('app.title') : title}
						</Link>
						{isLG && <TopNav />}
					</div>
					<div className='d-flex justify-content-between align-items-center'>
						<LanguageDropdown />
						<Notifications />
						<PersonalNav />
					</div>
				</div>
			</CRC>
		</header>
	)
})
