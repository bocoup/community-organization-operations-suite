/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState, useEffect } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import ClientOnly from '~ui/ClientOnly'
import cx from 'classnames'
import MultiActionButton, { IMultiActionButtons } from '~ui/MultiActionButton2'
import { Col, Row } from 'react-bootstrap'

interface ContactDataAccessPrefProps extends ComponentProps {
	title?: string
	accessPreferences?: any[]
	loading?: boolean
}

const ContactDataAccessPref = memo(function ContactDataAccessPref({
	title,
	accessPreferences,
	loading
}: ContactDataAccessPrefProps): JSX.Element {
	const [filteredList, setFilteredList] = useState<any[]>(accessPreferences)

	useEffect(() => {
		if (accessPreferences) {
			setFilteredList(accessPreferences)
		}
	}, [accessPreferences])

	const pageColumns: IPaginatedListColumn[] = [
		{
			key: 'dataType',
			name: 'Data Type',
			onRenderColumnItem: function onRenderColumnItem(accessPref: any): JSX.Element {
				return <span>{accessPref.dataType}</span>
			}
		},
		{
			key: 'currentInfo',
			name: 'Current Information',
			className: 'col-5',
			onRenderColumnItem: function onRenderColumnItem(accessPref: any): JSX.Element {
				return <span>{accessPref.currentInformation}</span>
			}
		},
		{
			key: 'permissions',
			name: 'Permissions',
			onRenderColumnItem: function onRenderColumnItem(accessPref: any): JSX.Element {
				return <span>{accessPref.permission}</span>
			}
		},
		{
			key: 'lastRequested',
			name: 'Last Requested',
			onRenderColumnItem: function onRenderColumnItem(accessPref: any): JSX.Element {
				return <span>{accessPref.lastRequested}</span>
			}
		},
		{
			key: 'actionColumn',
			name: '',
			className: 'd-flex justify-content-end',
			onRenderColumnItem: function onRenderColumnItem(accessPref: any): JSX.Element {
				const columnActionButtons: IMultiActionButtons<any[]>[] = [
					{
						name: 'Edit',
						className: cx(styles.manageButton)
					}
				]
				return <MultiActionButton columnItem={accessPref} buttonGroup={columnActionButtons} />
			}
		}
	]

	const permissionLegends = [
		{
			name: 'Accept All',
			description: 'Accept any request for this personal information.',
			className: styles.acceptAll
		},
		{
			name: 'Delegated',
			description: 'Delegate the sharing of this personal information to any approved delegate.',
			className: styles.delegated
		},
		{
			name: 'Request Only',
			description: 'This personal information can only be shared if I approve it.',
			className: styles.requestOnly
		},
		{
			name: 'Deny All',
			description: 'Reject any request for this personal information.',
			className: styles.denyAll
		}
	]

	return (
		<ClientOnly>
			<div className={cx('mt-5 mb-5 pb-3', styles.listWrapper)}>
				<PaginatedList
					title={title}
					description={
						'Here you can control what data you are willing to share, and who can access your data.'
					}
					list={filteredList}
					itemsPerPage={10}
					columns={pageColumns}
					columnsClassName={styles.headerRow}
					rowClassName={cx('align-items-center', styles.itemRow)}
					isLoading={loading}
				/>
			</div>
			<div className={cx('mt-5 mb-5 pb-3')}>
				<h2>What do the different permissions mean?</h2>
				<Col>
					<Row>
						{permissionLegends.map(legend => {
							return (
								<Col key={legend.name}>
									<div className={cx(styles.legend, legend.className)}>
										<div className={styles.legendTitle}>{legend.name}</div>
										<div className={styles.legendDescription}>{legend.description}</div>
									</div>
								</Col>
							)
						})}
						<Col></Col>
					</Row>
				</Col>
			</div>
		</ClientOnly>
	)
})
export default ContactDataAccessPref
