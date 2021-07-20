/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styles from './index.module.scss'
import DefaultLayout, { DefaultLayoutProps } from '~layouts/Default'
import CRC from '~ui/CRC'
import ClientOnly from '~ui/ClientOnly'
import ActionBar from '~ui/ActionBar'

interface MyDataLayoutProps extends DefaultLayoutProps {
	title?: string
	documentTitle?: string
}

const MyDataLayout = memo(function MyDataLayout({
	documentTitle,
	children
}: MyDataLayoutProps): JSX.Element {
	return (
		<DefaultLayout title={documentTitle}>
			<ClientOnly className={styles.actionBar}>
				<ActionBar
					showNav={false}
					showTitle={true}
					title={documentTitle}
					showPersona
					showNotifications
					className={styles.actionBarColor}
				/>
			</ClientOnly>
			<CRC className={styles.content}>{children}</CRC>
		</DefaultLayout>
	)
})
export default MyDataLayout
