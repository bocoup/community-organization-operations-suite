/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FontIcon } from '@fluentui/react'
import { useRouter } from 'next/router'
import ComponentProps from '~types/ComponentProps'
import IRequest, { RequestStatus } from '~types/Request'

interface RequestActionBarTitleProps extends ComponentProps {
	title?: string
	request: IRequest
}

export default function RequestActionBarTitle({
	request
}: RequestActionBarTitleProps): JSX.Element {
	const router = useRouter()
	const { status } = request
	const title = status === RequestStatus.Open ? 'Open Request' : 'Assigned to:'

	return (
		<div className='d-flex align-items-center pointer'>
			<FontIcon iconName='ChevronLeft' className='me-2' onClick={router.back} />

			{title}
		</div>
	)
}
