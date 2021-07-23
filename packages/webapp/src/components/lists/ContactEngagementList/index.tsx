/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState, useCallback, useEffect } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import { ContactEngagement } from '@resolve/schema/lib/client-types'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import ClientOnly from '~ui/ClientOnly'
import cx from 'classnames'
import MultiActionButton, { IMultiActionButtons } from '~ui/MultiActionButton2'
import ShortString from '~ui/ShortString'
import useWindowSize from '~hooks/useWindowSize'
import { getTimeDuration } from '~utils/getTimeDuration'

interface ContactEngagementListProps extends ComponentProps {
	title?: string
	contactEngagementList?: ContactEngagement[]
	loading?: boolean
}

const ContactEngagementList = memo(function ContactEngagementList({
	title,
	contactEngagementList,
	loading
}: ContactEngagementListProps): JSX.Element {
	const { isMD } = useWindowSize()
	const [filteredList, setFilteredList] = useState<ContactEngagement[]>(contactEngagementList)

	useEffect(() => {
		if (contactEngagementList) {
			setFilteredList(contactEngagementList)
		}
	}, [contactEngagementList])

	const searchList = useCallback(
		(searchStr: string) => {
			const filteredEngagements = contactEngagementList.filter(
				(e: ContactEngagement) =>
					e.user.name.first.toLowerCase().includes(searchStr.toLowerCase()) ||
					e.user.name.last.toLowerCase().includes(searchStr.toLowerCase()) ||
					e.description.toLowerCase().includes(searchStr.toLowerCase())
			)
			setFilteredList(filteredEngagements)
		},
		[contactEngagementList]
	)

	const pageColumns: IPaginatedListColumn[] = [
		{
			key: 'name',
			name: 'Assigned Specialist',
			onRenderColumnItem: function onRenderColumnItem(c: ContactEngagement): JSX.Element {
				return (
					<span>
						{c?.user.name.first} {c?.user.name.last}
					</span>
				)
			}
		},
		{
			key: 'description',
			name: 'Description',
			className: 'col-5',
			onRenderColumnItem: function onRenderColumnItem(c: ContactEngagement): JSX.Element {
				return <ShortString text={c?.description} limit={isMD ? 64 : 24} />
			}
		},
		{
			key: 'requestDate',
			name: 'Request Date',
			onRenderColumnItem: function onRenderColumnItem(c: ContactEngagement): JSX.Element {
				return <span>{new Date(c.startDate).toLocaleDateString()}</span>
			}
		},
		{
			key: 'timeDuration',
			name: 'Time Remaining',
			onRenderColumnItem: function onRenderColumnItem(c: ContactEngagement) {
				const { duration, unit } = getTimeDuration(new Date().toISOString(), c.endDate)
				if (unit === 'Overdue') {
					return 'Overdue'
				}

				const translatedUnit = unit.toLowerCase()
				return `${duration} ${translatedUnit}`
			}
		},
		{
			key: 'actionColumn',
			name: '',
			className: 'd-flex justify-content-end',
			onRenderColumnItem: function onRenderColumnItem(c: ContactEngagement): JSX.Element {
				const columnActionButtons: IMultiActionButtons<ContactEngagement>[] = [
					{
						name: 'Manage',
						className: cx(styles.manageButton)
					}
				]
				return <MultiActionButton columnItem={c} buttonGroup={columnActionButtons} />
			}
		}
	]

	return (
		<ClientOnly>
			<div className={cx('mt-5 mb-5 pb-3', styles.listWrapper)}>
				<PaginatedList
					title={title}
					description={
						'Below is your list of requests for assistance with community organizations.  If you are tagged in a request and did not ask for assistance, or no longer require assistance, you can close the ticket using the buttons on the right.'
					}
					list={filteredList}
					itemsPerPage={10}
					columns={pageColumns}
					columnsClassName={styles.headerRow}
					rowClassName={cx('align-items-center', styles.itemRow)}
					//onSearchValueChange={value => searchList(value)}
					isLoading={loading}
				/>
			</div>
		</ClientOnly>
	)
})
export default ContactEngagementList
