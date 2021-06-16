/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import DefaultLayout, { DefaultLayoutProps } from '~layouts/Default'
import ActionBar from '~ui/ActionBar'
import CRC from '~ui/CRC'

export interface ContainerLayoutProps extends DefaultLayoutProps {
	title?: string
	size?: 'sm' | 'md' | 'lg'
	showTitle?: boolean
	orgName?: string
}

export default function ContainerLayout({
	children,
	title,
	size,
	showTitle = true,
	showNav = true,
	orgName
}: ContainerLayoutProps): JSX.Element {
	return (
		<>
			<DefaultLayout showNav={showNav}>
				<ActionBar
					showNav={showNav}
					showTitle={showTitle}
					title={orgName}
					showPersona
					showNotifications
				/>

				<CRC size={size}>
					<>
						{title && <h1 className='mt-5'>{title}</h1>}

						{children}
					</>
				</CRC>
			</DefaultLayout>
		</>
	)
}
