/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo, useState } from 'react'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import SpecialistHeader from '~ui/SpecialistHeader'
import ShortString from '~components/ui/ShortString'
import { useTranslation } from '~hooks/useTranslation'
import cx from 'classnames'
import { useSpecialist } from '~hooks/api/useSpecialist'

interface SpecialistPanelBodyProps extends ComponentProps {
	specialistId: string
}

const SpecialistPanelBody = memo(function SpecialistPanelBody({
	specialistId
}: SpecialistPanelBodyProps): JSX.Element {
	const { t } = useTranslation('specialists')
	const { specialistList } = useSpecialist()
	const [specialist] = useState(specialistList.find((s) => s.id === specialistId))

	return (
		<>
			<SpecialistHeader specialist={specialist} />
			<div className={cx(styles.specialistDetailsWrapper)}>
				<div className='mb-3 mb-lg-5'>
					<h3 className='mb-2 mb-lg-4 '>
						<strong>{t('viewSpecialist.body.bio')}</strong>
					</h3>
					{specialist?.description ? (
						<ShortString text={specialist.description} limit={240} />
					) : (
						<div>{t('viewSpecialist.body.noDetails')}</div>
					)}
				</div>
				<div className='mb-3 mb-lg-5'>
					<h3 className='mb-2 mb-lg-4 '>
						<strong>{t('viewSpecialist.body.trainingAchievement')}</strong>
					</h3>
					{specialist?.additionalInfo ? (
						<ShortString text={specialist.additionalInfo} limit={240} />
					) : (
						<div>{t('viewSpecialist.body.noDetails')}</div>
					)}
				</div>
			</div>
		</>
	)
})
export default SpecialistPanelBody
