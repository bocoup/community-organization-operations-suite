/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StandardFC } from '~types/StandardFC'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { memo } from 'react'
import { DefaultButton } from '@fluentui/react/lib/Button'
import cx from 'classnames'
import styles from './index.module.scss'
import type { IIconProps } from '@fluentui/react'
import { useNavCallback } from '~hooks/useNavCallback'
import { ApplicationRoute } from '~types/ApplicationRoute'

interface ScanManagerBodyProps {
	onClose?: () => void
	isLoaded?: (loaded: boolean) => void
}

export const ScanManagerBody: StandardFC<ScanManagerBodyProps> = memo(
	function ScanFormPanelBody({}) {
		const onTakePhotoClick = useNavCallback(ApplicationRoute.ScanImage)
		const { t } = useTranslation(Namespace.Scan)
		const circleIcon: IIconProps = { iconName: 'CircleShapeSolid' }

		return (
			<>
				<div className={cx(styles.scanManagerTopButtonContainer)}>
					<DefaultButton
						text={t('scanManager.startScanButton')}
						iconProps={circleIcon}
						onClick={() => {
							onTakePhotoClick()
						}}
					/>
				</div>
			</>
		)
	}
)
