/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { User } from '@greenlight/schema/lib/client-types'
import { Col, Row } from 'react-bootstrap'
import cx from 'classnames'
import MultiActionButton, { IMultiActionButtons } from '~components/ui/MultiActionButton2'
import useWindowSize from '~hooks/useWindowSize'
import UserCardRow from '~components/ui/UserCardRow'
import CardRowTitle from '~ui/CardRowTitle'
import SpecialistPanel from '~components/ui/SpecialistPanel'
import SpecialistHeader from '~ui/SpecialistHeader'
import { useCallback, useState } from 'react'
import { useBoolean } from '@fluentui/react-hooks'
import ShortString from '~components/ui/ShortString'
import Panel from '~ui/Panel'
import AddSpecialistForm from '~components/forms/AddSpecialistForm'
import EditSpecialistForm from '~components/forms/EditSpecialistForm'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'

interface SpecialistListProps extends ComponentProps {
	title?: string
	specialistList?: User[]
}

export default function SpecialistList({
	specialistList,
	title
}: SpecialistListProps): JSX.Element {
	const { isMD } = useWindowSize()
	const [isOpen, { setTrue: openSpecialistPanel, setFalse: dismissSpecialistPanel }] = useBoolean(
		false
	)
	const [
		isNewFormOpen,
		{ setTrue: openNewSpecialistPanel, setFalse: dismissNewSpecialistPanel }
	] = useBoolean(false)

	const [
		isEditFormOpen,
		{ setTrue: openEditSpecialistPanel, setFalse: dismissEditSpecialistPanel }
	] = useBoolean(false)

	const [specialist, setSpecialist] = useState<User | undefined>()

	const sortedList = Object.values(specialistList).sort((a, b) =>
		a.name.first > b.name.first ? 1 : -1
	)

	const [filteredList, setFilteredList] = useState<User[]>(sortedList)

	const openSpecialistDetails = useCallback(
		(sid: string) => {
			const selectedSpecialist = specialistList.find((s: User) => s.id === sid)
			setSpecialist(selectedSpecialist)
			openSpecialistPanel()
		},
		[openSpecialistPanel, specialistList]
	)

	const searchList = useCallback(
		(searchStr: string) => {
			if (searchStr === '') {
				setFilteredList(sortedList)
			} else {
				const filteredUsers = sortedList.filter(
					(user: User) =>
						user.name.first.toLowerCase().indexOf(searchStr) > -1 ||
						user.name.last.toLowerCase().indexOf(searchStr) > -1
				)
				setFilteredList(filteredUsers)
			}
		},
		[sortedList]
	)

	const columnActionButtons: IMultiActionButtons<User>[] = [
		{
			name: 'Edit',
			className: cx(styles.editButton),
			onActionClick: function onActionClick(user: User) {
				setSpecialist(user)
				openEditSpecialistPanel()
			}
		}
	]

	const pageColumns: IPaginatedListColumn[] = [
		{
			key: 'name',
			name: 'Name',
			fieldName: ['name.first', ' ', 'name.last'],
			onRenderColumnItem: function onRenderColumnItem(user: User) {
				return (
					<CardRowTitle
						tag='span'
						title={`${user.name.first} ${user.name.last}`}
						titleLink='/'
						onClick={() => openSpecialistDetails(user.id)}
					/>
				)
			}
		},
		{
			key: 'numOfEngagement',
			name: '# of Assigned Engagements',
			fieldName: 'activeEngagementCount'
		},
		{
			key: 'userName',
			name: 'Username',
			onRenderColumnItem: function onRenderColumnItem(user: User) {
				return `@${user.userName}`
			}
		},
		{
			key: 'permissions',
			name: 'Permissions',
			onRenderColumnItem: function onRenderColumnItem(user: User) {
				return <>{user?.roles?.map(r => r.roleType).join(', ')}</>
			}
		},
		{
			key: 'actionColumn',
			name: '',
			className: 'w-100 d-flex justify-content-end',
			onRenderColumnItem: function onRenderColumnItem(item: User) {
				return <MultiActionButton columnItem={item} buttonGroup={columnActionButtons} />
			}
		}
	]

	const mobileColumn: IPaginatedListColumn[] = [
		{
			key: 'cardItem',
			name: 'cardItem',
			onRenderColumnItem: function onRenderColumnItem(user: User, index: number) {
				return (
					<UserCardRow
						key={index}
						title={`${user.name.first} ${user.name.last}`}
						titleLink='/'
						body={
							<Col>
								<Row className='ps-2'>@{user.userName}</Row>
								<Row className='ps-2 pb-4'>{user?.roles?.map(r => r.roleType).join(', ')}</Row>
								<Row className='ps-2'>
									<Col>
										<Row># of Engagements</Row>
										<Row>0</Row>
									</Col>
									<Col className={cx('d-flex justify-content-end')}>
										<MultiActionButton buttonGroup={columnActionButtons} />
									</Col>
								</Row>
							</Col>
						}
						onClick={() => openSpecialistDetails(user.id)}
					/>
				)
			}
		}
	]

	return (
		<div className={cx('mt-5 mb-5', styles.specialistList)}>
			{isMD ? (
				<PaginatedList
					title={title}
					list={filteredList}
					itemsPerPage={20}
					columns={pageColumns}
					rowClassName='align-items-center'
					addButtonName='Add Specialist'
					onSearchValueChange={value => searchList(value)}
					onListAddButtonClick={() => openNewSpecialistPanel()}
				/>
			) : (
				<PaginatedList
					list={filteredList}
					itemsPerPage={10}
					columns={mobileColumn}
					hideListHeaders={true}
					addButtonName='Add Specialist'
					onSearchValueChange={value => searchList(value)}
					onListAddButtonClick={() => openNewSpecialistPanel()}
				/>
			)}
			<Panel openPanel={isNewFormOpen} onDismiss={() => dismissNewSpecialistPanel()}>
				<AddSpecialistForm title='Add Specialist' closeForm={() => dismissNewSpecialistPanel()} />
			</Panel>
			<Panel openPanel={isEditFormOpen} onDismiss={() => dismissEditSpecialistPanel()}>
				<EditSpecialistForm
					title='Edit Specialist'
					specialist={specialist}
					closeForm={() => dismissEditSpecialistPanel()}
				/>
			</Panel>
			<SpecialistPanel openPanel={isOpen} onDismiss={() => dismissSpecialistPanel()}>
				<SpecialistHeader specialist={specialist} />
				<div className={cx(styles.specialistDetailsWrapper)}>
					<div className='mb-3 mb-lg-5'>
						<h3 className='mb-2 mb-lg-4 '>
							<strong>Bio</strong>
						</h3>
						<ShortString text={specialist?.description} limit={240} />
					</div>
					{specialist?.additionalInfo && (
						<div className='mb-3 mb-lg-5'>
							<h3 className='mb-2 mb-lg-4 '>
								<strong>Training / Achievements</strong>
							</h3>
							<ShortString text={specialist.additionalInfo} limit={240} />
						</div>
					)}
				</div>
			</SpecialistPanel>
		</div>
	)
}
