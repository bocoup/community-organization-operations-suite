/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState, useEffect, useCallback } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import ClientOnly from '~ui/ClientOnly'
import PaginatedList, { IPaginatedListColumn } from '~components/ui/PaginatedList'
import cx from 'classnames'
import { useRouter } from 'next/router'
import { Service, ServiceCustomField, Tag } from '@cbosuite/schema/dist/client-types'
import CardRowTitle from '~components/ui/CardRowTitle'
import ShortString from '~ui/ShortString'
import useWindowSize from '~hooks/useWindowSize'
import TagBadge from '~components/ui/TagBadge'
import MultiActionButton, { IMultiActionButtons } from '~components/ui/MultiActionButton2'

import { Modal, TextField, DatePicker } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { Col, Row, Container } from 'react-bootstrap'
import { useTranslation } from '~hooks/useTranslation'

interface ServiceListProps extends ComponentProps {
	title?: string
	services?: Service[]
	loading?: boolean
}

const ServiceList = memo(function ServiceList({
	title,
	services = [],
	loading
}: ServiceListProps): JSX.Element {
	const [filteredList, setFilteredList] = useState<Service[]>(services)
	const router = useRouter()
	const { isMD } = useWindowSize()
	const { t } = useTranslation('services')
	const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false)
	const [selectedService, setSelectedService] = useState<Service | null>(null)

	useEffect(() => {
		if (services) {
			setFilteredList(services)
		}
	}, [services])

	const searchList = useCallback(
		(searchStr: string) => {
			// TODO: implement search query
			const filteredServiceList = services.filter(
				(s: Service) =>
					s.name.toLowerCase().includes(searchStr.toLowerCase()) ||
					s.description.toLowerCase().includes(searchStr.toLowerCase()) ||
					s.tags?.some((t: Tag) => t.label.toLowerCase().includes(searchStr.toLowerCase()))
			)
			setFilteredList(filteredServiceList)
		},
		[services]
	)

	const columnActionButtons: IMultiActionButtons<Service>[] = [
		{
			name: t('serviceListRowActions.start'),
			className: cx(styles.actionButton),
			onActionClick: function onActionClick(service: Service) {
				return null
			}
		},
		{
			name: t('serviceListRowActions.edit'),
			className: cx(styles.actionButton),
			onActionClick: function onActionClick(service: Service) {
				router.push(`${router.pathname}/editService?sid=${service.id}`, undefined, {
					shallow: true
				})
			}
		},
		{
			name: t('serviceListRowActions.preview'),
			className: cx(styles.actionButton),
			onActionClick: function onActionClick(service: Service) {
				setSelectedService(service)
				showModal()
			}
		}
	]

	const pageColumns: IPaginatedListColumn[] = [
		{
			key: 'name',
			name: t('serviceListColumns.name'),
			className: 'col-2',
			onRenderColumnItem: function onRenderColumnItem(service: Service) {
				return <CardRowTitle tag='span' title={service.name} titleLink='/' onClick={() => null} />
			}
		},
		{
			key: 'description',
			name: t('serviceListColumns.description'),
			className: 'col-4',
			onRenderColumnItem: function onRenderColumnItem(service: Service) {
				return <ShortString text={service.description} limit={isMD ? 64 : 24} />
			}
		},
		{
			key: 'tags',
			name: t('serviceListColumns.tags'),
			className: 'col-3',
			onRenderColumnItem: function onRenderColumnItem(service: Service) {
				if (service?.tags) {
					return service.tags.map((attr, idx) => {
						return <TagBadge key={idx} tag={{ id: attr.id, label: attr.label }} />
					})
				}

				return <></>
			}
		},
		{
			key: 'actions',
			name: '',
			className: 'd-flex justify-content-end',
			onRenderColumnItem: function onRenderColumnItem(service: Service) {
				return <MultiActionButton columnItem={service} buttonGroup={columnActionButtons} />
			}
		}
	]

	const onAddServiceClick = () => {
		router.push(`${router.pathname}/addService`, undefined, { shallow: true })
	}

	const renderField = (field: ServiceCustomField): JSX.Element => {
		if (field.fieldType === 'single-text') {
			return <TextField label={field.fieldName} required={field.fieldRequirements === 'required'} />
		}

		if (field.fieldType === 'multiline-text') {
			return (
				<TextField
					label={field.fieldName}
					autoAdjustHeight
					multiline
					required={field.fieldRequirements === 'required'}
				/>
			)
		}

		if (field.fieldType === 'date') {
			const today = new Date()
			return (
				<DatePicker
					label={field.fieldName}
					isRequired={field.fieldRequirements === 'required'}
					initialPickerDate={today}
					value={today}
				/>
			)
		}
	}

	return (
		<ClientOnly>
			<div className={cx('mt-5 mb-5', styles.serviceList)}>
				<PaginatedList
					title={title}
					list={filteredList}
					itemsPerPage={10}
					columns={pageColumns}
					rowClassName={'align-items-center'}
					addButtonName={t('serviceListAddButton')}
					onListAddButtonClick={() => onAddServiceClick()}
					onSearchValueChange={searchList}
					isLoading={loading}
				/>
				<Modal isOpen={isModalOpen} onDismiss={hideModal} isBlocking={false}>
					<div className={styles.previewFormWrapper}>
						<Container>
							<Row className='mb-5'>
								<Col>
									<h3>{selectedService?.name}</h3>
									<span>{selectedService?.description}</span>
								</Col>
							</Row>
							<Row className='mt-3 mb-5'>
								<Col>
									{selectedService?.customFields?.map((field, idx) => {
										return (
											<Row key={idx} className={cx('mb-3', styles.customField)}>
												{renderField(field)}
											</Row>
										)
									})}
								</Col>
							</Row>
						</Container>
					</div>
				</Modal>
			</div>
		</ClientOnly>
	)
})
export default ServiceList
