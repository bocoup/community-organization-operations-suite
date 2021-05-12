/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton } from '@fluentui/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import HappySubmitButton from '~components/ui/HappySubmitButton'
import ShortString from '~components/ui/ShortString'
import RequestActionForm from '~forms/RequestActionForm'
import RequestLayout from '~layouts/RequestLayout'
import RequestActionHistory from '~lists/RequestActionHistory'
import { getRequest, loadRequest } from '~slices/requestSlice'
// import IRequest, { RequestStatus } from '~types/Request'
import CRC from '~ui/CRC'
import RequestHeader from '~ui/RequestHeader'

export default function Profile(): JSX.Element {
	const router = useRouter()
	const { rid } = router.query
	const dispatch = useDispatch()
	// TODO: replace with reducer
	const request = useSelector(getRequest)
	// const request = FAKE_REQUEST

	// TODO: load proper request
	useEffect(() => {
		// Rid only present after page mounts
		if (rid) {
			dispatch(loadRequest({ id: rid }))
		}
	}, [rid, dispatch])

	// TODO: render empty state
	if (!request) {
		return null
	}

	return (
		<RequestLayout request={request}>
			<section className='w-100 bg-light'>
				<CRC size='sm'>
					<RequestHeader request={request} />
				</CRC>
			</section>
			<section className='pt-3 pt-md-5 mb-3 mb-lg-5'>
				<CRC size='sm'>
					<div className='mb-3 mb-lg-5'>
						{/* TODO: get string from localizations */}
						<h3 className='mb-2 mb-lg-4 '>
							<strong>Current Request</strong>
						</h3>
						<ShortString text={request.request} limit={240} />
					</div>
					{/* <RequestDetails request={request} /> */}
					{/* <RequestActionInput request={request} /> */}
					<RequestActionForm className='mb-5' />
					<RequestActionHistory className='mb-5' />

					{/* <RequestComplete request={request} /> */}
					<div className='d-flex mb-5 pb-5 align-items-center'>
						{/* TODO: get string from localizations */}
						<HappySubmitButton className='me-3 p-4' text='Request Complete' />
						{/* TODO: get string from localizations */}
						<DefaultButton
							className='me-3 p-4 border-primary text-primary'
							text='See Client History'
						/>
					</div>
				</CRC>
			</section>
		</RequestLayout>
	)
}
