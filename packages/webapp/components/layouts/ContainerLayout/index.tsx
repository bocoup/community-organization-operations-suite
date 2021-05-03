/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import DefaultLayout, { DefaultLayoutProps } from '~layouts/Default'
import CRC from '~ui/CRC'

export interface ContainerLayoutProps extends DefaultLayoutProps {
	title?: string
}

export default function ContainerLayout({
	children,
	title,
	showNav
}: ContainerLayoutProps): JSX.Element {
	return (
		<>
			<DefaultLayout showNav={showNav}>
				<CRC>
					<>
						{title && <h1 className='mt-5'>{title}</h1>}

						{children}
					</>
				</CRC>
			</DefaultLayout>
		</>
	)
}
