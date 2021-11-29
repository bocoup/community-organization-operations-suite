/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Contact, ServiceAnswer } from '@cbosuite/schema/dist/client-types'
import { useMemo } from 'react'
import { CustomOptionsFilter } from '~components/ui/CustomOptionsFilter'
import { CustomTextFieldFilter } from '~components/ui/CustomTextFieldFilter'
import { CLIENT_DEMOGRAPHICS } from '~constants'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import styles from '../../../index.module.scss'
import { IDropdownOption } from '@fluentui/react'
import { empty } from '~utils/noop'

export function useContactFormColumns(
	enabled: boolean,
	filterColumns: (columnId: string, option: IDropdownOption) => void,
	filterColumnTextValue: (key: string, value: string) => void,
	getDemographicValue: (demographicKey: string, contact: Contact) => string
) {
	const { t } = useTranslation(Namespace.Reporting, Namespace.Clients, Namespace.Services)
	return useMemo(
		() =>
			!enabled
				? empty
				: [
						{
							key: 'name',
							headerClassName: styles.headerItemCell,
							itemClassName: styles.itemCell,
							name: t('clientList.columns.name'),
							onRenderColumnHeader(key, name, index) {
								return (
									<CustomTextFieldFilter
										filterLabel={name}
										onFilterChanged={(value) => filterColumnTextValue(key, value)}
									/>
								)
							},
							onRenderColumnItem(item: ServiceAnswer, index: number) {
								return `${item?.contacts[0]?.name?.first} ${item?.contacts[0]?.name?.last}`
							}
						},
						{
							key: 'gender',
							headerClassName: styles.headerItemCell,
							itemClassName: styles.itemCell,
							name: t('demographics.gender.label'),
							onRenderColumnHeader(key, name, index) {
								return (
									<CustomOptionsFilter
										filterLabel={name}
										placeholder={name}
										options={CLIENT_DEMOGRAPHICS[key].options.map((o) => ({
											key: o.key,
											text: t(`demographics.${key}.options.${o.key}`)
										}))}
										onFilterChanged={(option) => filterColumns(key, option)}
									/>
								)
							},
							onRenderColumnItem(item: ServiceAnswer, index: number) {
								return getDemographicValue('gender', item.contacts[0])
							}
						},
						{
							key: 'race',
							headerClassName: styles.headerItemCell,
							itemClassName: styles.itemCell,
							name: t('demographics.race.label'),
							onRenderColumnHeader(key, name, index) {
								return (
									<CustomOptionsFilter
										filterLabel={name}
										placeholder={name}
										options={CLIENT_DEMOGRAPHICS[key].options.map((o) => ({
											key: o.key,
											text: t(`demographics.${key}.options.${o.key}`)
										}))}
										onFilterChanged={(option) => filterColumns(key, option)}
									/>
								)
							},
							onRenderColumnItem(item: ServiceAnswer, index: number) {
								return getDemographicValue('race', item.contacts[0])
							}
						},
						{
							key: 'ethnicity',
							headerClassName: styles.headerItemCell,
							itemClassName: styles.itemCell,
							name: t('demographics.ethnicity.label'),
							onRenderColumnHeader(key, name, index) {
								return (
									<CustomOptionsFilter
										filterLabel={name}
										placeholder={name}
										options={CLIENT_DEMOGRAPHICS[key].options.map((o) => ({
											key: o.key,
											text: t(`demographics.${key}.options.${o.key}`)
										}))}
										onFilterChanged={(option) => filterColumns(key, option)}
									/>
								)
							},
							onRenderColumnItem(item: ServiceAnswer, index: number) {
								return getDemographicValue('ethnicity', item.contacts[0])
							}
						},
						{
							key: 'preferredLanguage',
							headerClassName: styles.headerItemCell,
							itemClassName: styles.itemCell,
							name: t('demographics.preferredLanguage.label'),
							onRenderColumnHeader(key, name, index) {
								return (
									<CustomOptionsFilter
										filterLabel={name}
										placeholder={name}
										options={CLIENT_DEMOGRAPHICS[key].options.map((o) => ({
											key: o.key,
											text: t(`demographics.${key}.options.${o.key}`)
										}))}
										onFilterChanged={(option) => filterColumns(key, option)}
									/>
								)
							},
							onRenderColumnItem(item: ServiceAnswer, index: number) {
								return getDemographicValue('preferredLanguage', item.contacts[0])
							}
						},
						{
							key: 'preferredContactMethod',
							headerClassName: styles.headerItemCell,
							itemClassName: styles.itemCell,
							name: t('demographics.preferredContactMethod.label'),
							onRenderColumnHeader(key, name, index) {
								return (
									<CustomOptionsFilter
										filterLabel={name}
										placeholder={name}
										options={CLIENT_DEMOGRAPHICS[key].options.map((o) => ({
											key: o.key,
											text: t(`demographics.${key}.options.${o.key}`)
										}))}
										onFilterChanged={(option) => filterColumns(key, option)}
									/>
								)
							},
							onRenderColumnItem(item: ServiceAnswer, index: number) {
								return getDemographicValue('preferredContactMethod', item.contacts[0])
							}
						},
						{
							key: 'preferredContactTime',
							headerClassName: styles.headerItemCell,
							itemClassName: styles.itemCell,
							name: t('demographics.preferredContactTime.label'),
							onRenderColumnHeader(key, name, index) {
								return (
									<CustomOptionsFilter
										filterLabel={name}
										placeholder={name}
										options={CLIENT_DEMOGRAPHICS[key].options.map((o) => ({
											key: o.key,
											text: t(`demographics.${key}.options.${o.key}`)
										}))}
										onFilterChanged={(option) => filterColumns(key, option)}
									/>
								)
							},
							onRenderColumnItem(item: ServiceAnswer, index: number) {
								return getDemographicValue('preferredContactTime', item.contacts[0])
							}
						}
				  ],
		[enabled, filterColumnTextValue, filterColumns, getDemographicValue, t]
	)
}
