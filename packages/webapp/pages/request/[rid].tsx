/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ShortString from '~components/ui/ShortString'
import RequestActionForm from '~forms/RequestActionForm'
import RequestLayout from '~layouts/RequestLayout'
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
		// Rid only present after page mounts the first time
		if (rid) {
			dispatch(loadRequest(rid))
		}
	}, [rid, dispatch])

	// TODO: render empty state
	if (!request) {
		return null
	}

	return (
		<RequestLayout request={request}>
			<section className='w-100 bg-light'>
				<CRC>
					<RequestHeader request={request} />
				</CRC>
			</section>
			<section className='pt-3 pt-md-5 mb-3 mb-lg-5'>
				<CRC>
					<div className='mb-3 mb-lg-5'>
						<h3>Current Request</h3>
						<ShortString text={request.request} limit={240} />
					</div>
					{/* <RequestDetails request={request} /> */}
					{/* <RequestActionInput request={request} /> */}
					<RequestActionForm />
					{/* <RequestHistory request={request} /> */}
					{/* <RequestComplete request={request} /> */}
				</CRC>
			</section>
		</RequestLayout>
	)
}
