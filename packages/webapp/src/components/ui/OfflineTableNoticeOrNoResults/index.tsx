/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { wrap } from '~utils/appinsights'
import { useOffline } from '~hooks/useOffline'
import { useTranslation } from '~hooks/useTranslation'
import styles from './index.module.scss'

export const OfflineTableNoticeOrNoResults = wrap(function OfflineTableNoticeOrNoResults() {
	const isOffline = useOffline()
	const { c } = useTranslation()

	const refresh = () => {
		window.location.reload()
	}

	return (
		<>
			{isOffline ? (
				<div className={styles.notice}>
					<svg
						width='48'
						height='48'
						viewBox='0 0 48 48'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							d='M33.7322 35.5L41.8661 43.6339C42.3543 44.122 43.1457 44.122 43.6339 43.6339C44.122 43.1457 44.122 42.3543 43.6339 41.8661L6.13388 4.36612C5.64573 3.87796 4.85427 3.87796 4.36612 4.36612C3.87796 4.85427 3.87796 5.64573 4.36612 6.13388L14.2105 15.9783C13.5809 17.2032 13.1745 18.5617 13.0448 20H12.75C8.46979 20 5 23.4698 5 27.75C5 32.0302 8.46979 35.5 12.75 35.5H33.7322ZM31.2322 33H12.75C9.8505 33 7.5 30.6495 7.5 27.75C7.5 24.8505 9.8505 22.5 12.75 22.5H14.25C14.9404 22.5 15.5 21.9404 15.5 21.25V21C15.5 19.8927 15.7117 18.8348 16.0969 17.8647L31.2322 33ZM40.5 27.75C40.5 29.7651 39.3647 31.5151 37.6988 32.3951L39.5214 34.2177C41.6175 32.8306 43 30.4517 43 27.75C43 23.4698 39.5302 20 35.25 20H34.9552C34.4499 14.3935 29.738 10 24 10C21.5501 10 19.2872 10.8009 17.4589 12.1552L19.2522 13.9485C20.6079 13.0339 22.2416 12.5 24 12.5C28.6944 12.5 32.5 16.3056 32.5 21V21.25C32.5 21.9404 33.0596 22.5 33.75 22.5H35.25C38.1495 22.5 40.5 24.8505 40.5 27.75Z'
							fill='#212121'
						/>
					</svg>
					<div className={styles.connectToInternet}>{c('offline.connectToTheInternet')}</div>
					<div className={styles.offlineNotice}>{c('offline.offlineNotice')}</div>
					<div className={styles.tryAgain}>
						<button
							className='btn btn-primary'
							type='button'
							aria-label={c('offline.tryAgain')}
							onClick={() => refresh()}
						>
							{c('offline.tryAgain')}
						</button>
					</div>
				</div>
			) : (
				c('paginatedList.noResults')
			)}
		</>
	)
})