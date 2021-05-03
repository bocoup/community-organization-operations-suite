import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Layout from '~layouts/Default'
import { getRequest, loadRequest } from '~store/slices/request'
import CRC from '~ui/CRC'
import RequestHeader from '~ui/RequestHeader'

export default function Profile(): JSX.Element {
	const router = useRouter()
	const { rid } = router.query
	const dispatch = useDispatch()
	const request = useSelector(getRequest)

	useEffect(() => {
		dispatch(loadRequest(rid))
	}, [rid, dispatch])

	return (
		<Layout>
			<div className='w-100 bg-light'>
				<CRC>
					<RequestHeader request={request} />
				</CRC>
			</div>
		</Layout>
	)
}
