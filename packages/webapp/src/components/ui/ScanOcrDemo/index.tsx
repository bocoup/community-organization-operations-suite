/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * Demo Code
 * Needs to be clean up in next sprint
 */

import { useRef, useState, memo } from 'react'
import scanFile from '~utils/ocrDemo'
import { ScanOcrDemoDatePicker } from '~components/ui/ScanOcrDemoDataPicker'
import { DefaultButton } from '@fluentui/react/lib/Button'
import type { StandardFC } from '~types/StandardFC'
import { Checkbox, Stack } from '@fluentui/react'
import { TextField } from '@fluentui/react/lib/TextField'
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner'
import cx from 'classnames'
import styles from './index.module.scss'

let inputElement = null
let imgSrc = null
let imgResult = null

function confidenceColour(confidence) {
	let colour = ''
	if (confidence > 80.0) {
		colour = 'green'
	} else if (confidence < 80.0 && confidence > 50.0) {
		colour = 'goldenrod'
	} else {
		colour = 'red'
	}
	return colour
}

function containsDateInKey(key) {
	return key.toLowerCase().includes('date') ? true : false
}

function createDateField(key, possibleDate) {
	const date = new Date(possibleDate)
	return <ScanOcrDemoDatePicker label={key} inputValue={date} />
}

function input(key, inputValue, formattedConfidence, className) {
	if (inputValue === ':selected:') {
		return (
			<div style={{}}>
				<Stack>
					<Checkbox label={key} defaultChecked />
				</Stack>
				<h5
					className={cx('mb-2')}
					style={{ color: confidenceColour(formattedConfidence) }}
				>{`Confidence: ${formattedConfidence}%`}</h5>
			</div>
		)
	} else if (inputValue === ':unselected:') {
		return (
			<>
				<div style={{}}>
					<Stack>
						<Checkbox label={key} />
					</Stack>
					<h5
						className={cx('mb-2')}
						style={{ whiteSpace: 'nowrap', color: confidenceColour(formattedConfidence) }}
					>{`Confidence: ${formattedConfidence}%`}</h5>
				</div>
			</>
		)
	} else {
		return (
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				{containsDateInKey(key) ? (
					createDateField(key, inputValue)
				) : (
					<TextField label={key} defaultValue={inputValue} />
				)}

				<h5
					className={cx('mb-2')}
					style={{ color: confidenceColour(formattedConfidence) }}
				>{`Confidence: ${formattedConfidence}%`}</h5>
			</div>
		)
	}
}

function showResult(results) {
	const show = []
	for (const { key, value, confidence } of results) {
		const formattedConfidence = (confidence * 100).toFixed(2)
		show.push(
			<div key={show.length} style={{ padding: '5px', fontSize: 'initial' }}>
				{input(key, value, formattedConfidence, styles.formikField)}
			</div>
		)
	}
	return show
}

interface ScanOcrDemoProps {
	onClose?: () => void
	isLoaded?: (loaded: boolean) => void
}

export const ScanOcrDemo: StandardFC<ScanOcrDemoProps> = memo(function ScanOcrDemo({}) {
	const imgRef = useRef(null)
	const [scanResult, setScanResult] = useState(null)
	const [imgHeight, setImgHeight] = useState('700px')
	const [imgWidth, setImgWidth] = useState('700px')
	const [isSpinnerShowing, setIsSpinnerShowing] = useState(false)
	const turnOnNativeCameraApp = () => {
		inputElement.click()
	}

	return (
		<>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					padding: '20px 0px 20px 0px'
				}}
			>
				<DefaultButton
					className={cx('py-4', styles.startCameraButton)}
					text={'Start Camera'}
					style={{ fontSize: 'large' }}
					onClick={turnOnNativeCameraApp}
				/>
				<input
					ref={(input) => (inputElement = input)}
					id='camerFileInput'
					type='file'
					accept='image/png'
					capture='environment' //'environment' Or 'user'
					style={{ display: 'none' }}
					onChange={async (event) => {
						imgRef.current.style.opacity = 1
						setScanResult(null)
						setIsSpinnerShowing(true)
						const imgFile = event.target.files[0]
						imgSrc = window.URL.createObjectURL(imgFile)
						imgRef.current.setAttribute('src', imgSrc)
						imgResult = await scanFile(imgFile)
						setScanResult(imgResult)
						setImgHeight(imgRef.current.height + 'px')
						setImgWidth(imgRef.current.width + 'px')
					}}
				/>
			</div>
			<div style={{ display: 'flex' }}>
				<img
					id='pictureFromCamera'
					ref={imgRef}
					alt='Taken from mobile'
					style={{
						width: '50%',
						height: '100%',
						background: '#edebe9',
						color: '#edebe9',
						opacity: 0
					}}
				/>
				{scanResult !== null ? (
					<div
						style={{
							height: imgHeight,
							width: imgWidth,
							padding: '0px 0px 15px 15px',
							overflowY: 'auto',
							borderStyle: 'double',
							borderColor: '#0078D4'
						}}
					>
						<form>{showResult(imgResult)}</form>
					</div>
				) : (
					<div style={{ margin: 'auto' }}>
						{isSpinnerShowing ? <Spinner size={SpinnerSize.large} /> : <p></p>}
					</div>
				)}
			</div>
		</>
	)
})
