/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IColumn } from '@fluentui/react'
import { useSelector } from 'react-redux'
import { getSpecialists } from '~slices/navigatorsSlice'
import CardRow from '~ui/CardRow'
import CardRowFooterItem from '~ui/CardRowFooterItem'
import CardRowTitle from '~ui/CardRowTitle'
import DetailsList from '~ui/DetailsList'
import MultiActionButton from '~ui/MultiActionButton'
import Status from '~ui/Status'
import getItemHeader from '~utils/getItemHeader'
import Panel from '~ui/Panel'
import NewNavigatorActionForm from '~components/forms/NewNavigatorActionForm'
import { useBoolean } from '@fluentui/react-hooks'

export default function NavigatorsList(): JSX.Element {
	const navigators = useSelector(getSpecialists)

	const navigatorsColumns: IColumn[] = [
		{
			key: 'nameCol',
			name: 'Name',
			fieldName: 'fullName',
			minWidth: 200,
			maxWidth: 240,
			onRender: function onRequestRender(item: Record<string, any>) {
				return (
					<CardRowTitle tag='span' title={item.fullName} titleLink={`/specialist/${item.id}`} />
				)
			}
		},
		{
			key: 'statusCol',
			name: 'Status',
			fieldName: 'status',
			minWidth: 200,
			// TODO: move onStatusRender to its own component
			onRender: function onStatusRender(item: Record<string, any>) {
				return <Status status={item.status} />
			}
		},
		{
			key: 'numOfRequestsCol',
			name: '# of Requests',
			fieldName: 'numOfRequests',
			minWidth: 200,
			// TODO: move onNumOfRequestRender to its own component
			onRender: function onNumOfRequestRender(item: Record<string, any>) {
				/* eslint-disable */
				const assigned = item?.requests?.assigned
					? `${item.requests.assigned} Assigned${item?.requests?.open && ','} `
					: ''
				const open = item?.requests?.open ? `${item.requests.open} Opened` : ''

				return `${assigned} ${open}`
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

	console.log('navigator list', navigators)
	return (
		<DetailsList
			title='Navigators'
			items={navigators}
			columns={navigatorsColumns}
			addItemComponent={
				<Panel
					buttonOptions={{
						label: 'Add Specialist',
						icon: 'CircleAdditionSolid'
					}}
				>
					<NewNavigatorActionForm title='New Specialist' />
				</Panel>
			}
			onRenderRow={props => {
				const assigned = props.item?.requests?.assigned
					? `${props.item.requests.assigned} Assigned${props.item?.requests?.open && ','} `
					: ''
				const open = props.item?.requests?.open ? `${props.item.requests.open} Opened` : ''

				return (
					<CardRow
						item={props}
						title='fullName'
						// TODO: this should probably just be included as a link returned from the server
						titleLink={`/specialist/${props?.item?.id ?? ''}`}
						body={<Status status={props?.item?.status} />}
						bodyLimit={90}
						actions={[() => {}]}
						footNotes={[
							<CardRowFooterItem
								key={'single-footer-item'}
								title={getItemHeader('numOfRequests', props)}
								body={`${assigned} ${open}`}
							/>
						]}
					/>
				)
			}}
		/>
	)
}
