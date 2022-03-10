/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styles from './index.module.scss'
import type { StandardFC } from '~types/StandardFC'
import { memo } from 'react'
import { Spinner, SpinnerSize } from '@fluentui/react'

export const LoadingPlaceholder: StandardFC = memo(function LoadingPlaceholder() {
	return (
		<div className={styles.spinnerContainer}>
			<Spinner className='waitSpinner' size={SpinnerSize.large} />
		</div>
	)
})
