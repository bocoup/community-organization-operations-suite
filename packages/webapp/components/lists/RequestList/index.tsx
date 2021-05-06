/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IColumn } from '@fluentui/react'
import { useSelector } from 'react-redux'
import MultiActionButton from '~components/ui/MultiActionButton'
import useWindowSize from '~hooks/useWindowSize'
import { getMyRequests } from '~slices/myRequestsSlice'
import CardRow from '~ui/CardRow'
import DetailsList from '~ui/DetailsList'
import ShortString from '~ui/ShortString'

export default function MyRequests(): JSX.Element {
	const { isXL, isXXL } = useWindowSize()
	const requests = useSelector(getMyRequests)
	const myRequestsColumns: IColumn[] = [
		{
			key: 'nameCol',
			name: 'Name',
			fieldName: 'fullName',
			minWidth: 100,
			maxWidth: 200
		},
		{
			key: 'requestCol',
			name: 'Request',
			fieldName: 'request',
			isMultiline: true,
			minWidth: 300,
			onRender: function onRequestRender(item: Record<string, any>) {
				return <ShortString text={item.request} limit={isXXL ? 72 : isXL ? 64 : 24} />
			}
		},
		{
			key: 'timeRemainingCol',
			name: 'Time Remaining',
			fieldName: 'timeRemaining',
			minWidth: 150
		},
		{
			key: 'statusCol',
			name: 'Status',
			fieldName: 'status',
			minWidth: 200
		},
		{
			key: 'actionCol',
			name: '',
			fieldName: 'action',
			minWidth: 50,
			onRender: function actionRender() {
				return (
					<div className='w-100 d-flex justify-content-end'>
						<MultiActionButton />
					</div>
				)
			}
		}
	]

	const handleNewRequest = () => {
		console.log('new request')
	}

	return (
		<DetailsList
			title='Requests'
			items={requests}
			columns={myRequestsColumns}
			onAdd={handleNewRequest}
			onRenderRow={props => (
				<CardRow
					item={props}
					title='fullName'
					// TODO: this should probabl y just be included as a link returned from the server
					/* eslint-disable */
					titleLink={`/profile/${props?.item?.id ?? ''}`}
					body='request'
					bodyLimit={90}
					footNotes={['timeRemaining', 'status']}
					actions={[() => {}]}
				/>
			)}
			addLabel='Add Request'
		/>
	)
}
