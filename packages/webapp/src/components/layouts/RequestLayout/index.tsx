/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import RequestActionBarTitle from '~components/ui/RequestActionBarTitle'
import DefaultLayout from '~layouts/Default'
import type ComponentProps from '~types/ComponentProps'
import IRequest from '~types/Request'
import ActionBar from '~ui/ActionBar'

// TODO: Change request to come from store
interface RequestLayoutProps extends ComponentProps {
	title?: string
	request?: IRequest
}

const RequestLayout = memo(function RequestLayout({
	title,
	request,
	children
}: RequestLayoutProps): JSX.Element {
	// const title = rq
	return (
		<DefaultLayout>
			<ActionBar
				showTitle
				showPersona
				showNav
				title={<RequestActionBarTitle request={request} />}
			/>

			<>{children}</>
		</DefaultLayout>
	)
})
export default RequestLayout
