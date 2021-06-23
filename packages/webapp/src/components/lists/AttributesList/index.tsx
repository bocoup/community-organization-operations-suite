/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import cx from 'classnames'
import type ComponentProps from '~types/ComponentProps'
import ClientOnly from '~components/ui/ClientOnly'
import useWindowSize from '~hooks/useWindowSize'
import { Attribute } from '@greenlight/schema/lib/client-types'
import { useState, useRef, useEffect, useCallback } from 'react'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import TagBadge from '~components/ui/TagBadge'
import ShortString from '~components/ui/ShortString'
import MultiActionButton, { IMultiActionButtons } from '~components/ui/MultiActionButton2'
import { useBoolean } from '@fluentui/react-hooks'
import AddAttributeForm from '~components/forms/AddAttributeForm'
import EditAttributeForm from '~components/forms/EditAttributeForm'
import Panel from '~components/ui/Panel'
import { useAttributes } from '~hooks/api/useAttributes'

interface AttributesListProps extends ComponentProps {
	title?: string
}

export default function AttributesList({ title }: AttributesListProps): JSX.Element {
	const { orgId, attributes } = useAttributes()
	const { isMD } = useWindowSize()
	const [isNewFormOpen, { setTrue: openNewAttributePanel, setFalse: dismissNewAttributePanel }] =
		useBoolean(false)
	const [isEditFormOpen, { setTrue: openEditAttributePanel, setFalse: dismissEditAttributePanel }] =
		useBoolean(false)

	const [filteredList, setFilteredList] = useState<Attribute[]>(attributes || [])
	const [selectedAttribute, setSelectedAttribute] = useState<Attribute>(null)

	const searchText = useRef<string>('')

	useEffect(() => {
		setFilteredList(attributes || [])
	}, [attributes])

	const searchList = useCallback(
		(searchStr: string) => {
			if (searchStr === '') {
				setFilteredList(attributes)
			} else {
				const filteredTags = attributes.filter(
					(attribute: Attribute) =>
						attribute?.label.toLowerCase().indexOf(searchStr) > -1 ||
						attribute?.description?.toLowerCase().indexOf(searchStr) > -1
				)
				setFilteredList(filteredTags)
			}

			searchText.current = searchStr
		},
		[attributes, searchText]
	)

	const columnActionButtons: IMultiActionButtons<Attribute>[] = [
		{
			name: 'Edit',
			className: cx(styles.editButton),
			onActionClick: function onActionClick(attribute: Attribute) {
				setSelectedAttribute(attribute)
				openEditAttributePanel()
			}
		}
	]

	const pageColumns: IPaginatedListColumn[] = [
		{
			key: 'attribute',
			name: 'Attribute',
			onRenderColumnItem: function onRenderColumnItem(attribute: Attribute) {
				return (
					<TagBadge
						tag={{ id: attribute.id, label: attribute.label, description: attribute.description }}
					/>
				)
			}
		},
		{
			key: 'description',
			name: 'Description',
			className: 'col-md-4',
			onRenderColumnItem: function onRenderColumnItem(attribute: Attribute) {
				return <ShortString text={attribute.description} limit={isMD ? 64 : 24} />
			}
		},
		{
			key: 'actionColumn',
			name: '',
			className: 'w-100 d-flex justify-content-end',
			onRenderColumnItem: function onRenderColumnItem(attribute: Attribute) {
				return <MultiActionButton columnItem={attribute} buttonGroup={columnActionButtons} />
			}
		}
	]

	return (
		<ClientOnly>
			<div className={cx('mt-5 mb-5')}>
				<PaginatedList
					title={title}
					list={filteredList}
					itemsPerPage={20}
					columns={pageColumns}
					rowClassName='align-items-center'
					addButtonName='New Attribute'
					onSearchValueChange={value => searchList(value)}
					onListAddButtonClick={() => openNewAttributePanel()}
				/>
				<Panel openPanel={isNewFormOpen} onDismiss={() => dismissNewAttributePanel()}>
					<AddAttributeForm
						title='New Attribute'
						orgId={orgId}
						closeForm={() => dismissNewAttributePanel()}
					/>
				</Panel>
				<Panel openPanel={isEditFormOpen} onDismiss={() => dismissEditAttributePanel()}>
					<EditAttributeForm
						title='Edit Attribute'
						orgId={orgId}
						attribute={selectedAttribute}
						closeForm={() => dismissEditAttributePanel()}
					/>
				</Panel>
			</div>
		</ClientOnly>
	)
}
