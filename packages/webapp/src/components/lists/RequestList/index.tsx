/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IColumn } from '@fluentui/react'
import MultiActionButton from '~components/ui/MultiActionButton'
import useWindowSize from '~hooks/useWindowSize'
import { useSelector, useDispatch } from 'react-redux'
import { RequestStatus } from '~types/Request'
import CardRow from '~ui/CardRow'
import CardRowTitle from '~ui/CardRowTitle'
import DetailsList from '~ui/DetailsList'
import ShortString from '~ui/ShortString'
import Panel from '~ui/Panel'
import AddRequestForm from '~forms/AddRequestForm'
import ComponentProps from '~types/ComponentProps'
import type { Engagement } from '@greenlight/schema/lib/client-types'
import { useBoolean } from '@fluentui/react-hooks'
import { useCallback } from 'react'
import { getRequest, loadRequest } from '~store/slices/requestSlice'
import RequestPanel from '~ui/RequestPanel'

interface RequestListProps extends ComponentProps {
	requests: Engagement[]
}

export default function RequestList({ requests }: RequestListProps): JSX.Element {
	const { isXL } = useWindowSize()
	const dispatch = useDispatch()
	const [isOpen, { setTrue: openRequestPanel, setFalse: dismissRequestPanel }] = useBoolean(false)
	const openRequestDetails = useCallback(
		(request: Engagement) => {
			dispatch(loadRequest({ request }))
			openRequestPanel()
		},
		[dispatch, openRequestPanel]
	)
	const request = useSelector(getRequest)

	// return null
	const requestsColumns: IColumn[] = [
		{
			key: 'nameCol',
			name: 'Name',
			fieldName: 'fullName',
			minWidth: 200,
			maxWidth: 240,
			onRender: function onRequestRender(request: Engagement) {
				const { first, last } = request?.contact?.name
				return (
					<CardRowTitle
						tag='span'
						title={`${first} ${last}`}
						titleLink='/'
						onClick={() => {
							openRequestDetails(request)
						}}
					/>
				)
			}
		},
		{
			key: 'requestCol',
			name: 'Request',
			fieldName: 'request',
			isMultiline: true,
			minWidth: 300,
			onRender: function onRequestRender(request: Engagement) {
				return <ShortString text={request.description} limit={isXL ? 64 : 24} />
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
			minWidth: 200,
			onRender: function onRequestRender(request: Engagement) {
				// TODO: String should be derived from translations data
				switch (request.status) {
					case RequestStatus.Pending:
						return 'In-Progress'
					case RequestStatus.Open:
					default:
						return 'Not Started'
				}
			}
		},
		{
			key: 'actionCol',
			name: '',
			fieldName: 'action',
			minWidth: 100,
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

	if (!requests) return null

	return (
		<>
			<DetailsList
				title={'Requests'}
				items={requests}
				columns={requestsColumns}
				addItemComponent={
					<Panel
						buttonOptions={{
							label: 'Add Request',
							icon: 'CircleAdditionSolid'
						}}
					>
						<AddRequestForm />
					</Panel>
				}
				onAdd={handleNewRequest}
				onRenderRow={props => {
					// TODO: resolve this lint issue
					/* eslint-disable */
					const id = (props.item as { id: string })?.id ? props.item.id : ''
					return (
						<CardRow
							item={props}
							title='requester.fullName'
							// TODO: this should probably just be included as a link returned from the server
							// es
							// titleLink={`/request/${id}`}
							body='request'
							bodyLimit={90}
							footNotes={['timeRemaining', 'status']}
							actions={[() => {}]}
							titleLink='/'
							onClick={() => openRequestDetails(props.item)}
						/>
					)
				}}
				addLabel='Add Request'
			/>
			<RequestPanel openPanel={isOpen} onDismiss={() => dismissRequestPanel()} request={request} />
		</>
	)
}
