/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IColumn } from '@fluentui/react'
import { useSelector } from 'react-redux'
import NewNavigatorActionForm from '~components/forms/NewNavigatorActionForm'
import { getSpecialists } from '~slices/navigatorsSlice'
import CardRow from '~ui/CardRow'
import CardRowFooterItem from '~ui/CardRowFooterItem'
import CardRowTitle from '~ui/CardRowTitle'
import DetailsList from '~ui/DetailsList'
import MultiActionButton from '~ui/MultiActionButton'
import Panel from '~ui/Panel'
import Status from '~ui/Status'
import getItemHeader from '~utils/getItemHeader'
import { useBoolean } from '@fluentui/react-hooks'
import SpecialistPanel from '~components/ui/SpecialistPanel'
import { useCallback, useState } from 'react'
import Specialist from '~types/Specialist'
import SpecialistHeader from '~ui/SpecialistHeader'
import cx from 'classnames'
import styles from './index.module.scss'
import ShortString from '~components/ui/ShortString'

export default function NavigatorsList(): JSX.Element {
	const navigators = useSelector(getSpecialists)
	const [isOpen, { setTrue: openSpecialistPanel, setFalse: dismissSpecialistPanel }] = useBoolean(
		false
	)
	const [specialist, setSpecialist] = useState<Specialist | undefined>()

	const openSpecialistDetails = useCallback(
		(sid: number) => {
			setSpecialist(navigators[sid - 1])
			openSpecialistPanel()
		},
		[openSpecialistPanel]
	)

	const navigatorsColumns: IColumn[] = [
		{
			key: 'nameCol',
			name: 'Name',
			fieldName: 'fullName',
			minWidth: 200,
			maxWidth: 240,
			onRender: function onRequestRender(item: Record<string, any>) {
				return (
					<CardRowTitle
						tag='span'
						title={item.fullName}
						titleLink={`/specialist/${item.id}`}
						onClick={() => openSpecialistDetails(item.id)}
					/>
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
		<>
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
							onClick={() => openSpecialistDetails(props?.item?.id)}
						/>
					)
				}}
			/>
			<SpecialistPanel openPanel={isOpen} onDismiss={() => dismissSpecialistPanel()}>
				<SpecialistHeader specialist={specialist} />
				<div className={cx(styles.specialistDetailsWrapper)}>
					<div className='mb-3 mb-lg-5'>
						{/* TODO: get string from localizations */}
						<h3 className='mb-2 mb-lg-4 '>
							<strong>Bio</strong>
						</h3>
						<ShortString text={specialist?.bio} limit={240} />
					</div>
					{specialist?.trainingAndAchievements && (
						<div className='mb-3 mb-lg-5'>
							{/* TODO: get string from localizations */}
							<h3 className='mb-2 mb-lg-4 '>
								<strong>Training / Achievments</strong>
							</h3>
							<ShortString text={specialist.trainingAndAchievements} limit={240} />
						</div>
					)}
				</div>
			</SpecialistPanel>
		</>
	)
}
