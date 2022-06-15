/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { StandardFC } from '~types/StandardFC'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { useEffect, memo, useState, useRef } from 'react'
import { DefaultButton } from '@fluentui/react'
import cx from 'classnames'
import styles from './index.module.scss'
import { useNavCallback } from '~hooks/useNavCallback'
import { ApplicationRoute } from '~types/ApplicationRoute'

const width = 640
let height = 0
let streaming = false
// let imageData = null

function setVideoSize(videoRef) {
	height = videoRef.current.videoHeight / (videoRef.current.videoWidth / width)
	videoRef.current.setAttribute('width', width)
	videoRef.current.setAttribute('height', height)
}

function setCanvasSize(canvasRef) {
	canvasRef.current.setAttribute('width', width)
	canvasRef.current.setAttribute('height', height)
}

function useVideo(videoRef, canvasRef) {
	useEffect(() => {
		videoRef.current.addEventListener(
			'canplay',
			function (ev) {
				if (!streaming) {
					setVideoSize(videoRef)
					setCanvasSize(canvasRef)

					streaming = true
				}
			},
			false
		)
	}, [videoRef, canvasRef])
}

function clearPhoto(canvasRef) {
	const context = canvasRef.current.getContext('2d')
	context.fillStyle = '#AAA'
	context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)

	// imageData = canvasRef.current.toDataURL('image/png')
	// photoRef.current.setAttribute('src', imageData)
}

function takePicture(videoRef, canvasRef) {
	const context = canvasRef.current.getContext('2d')
	if (width && height) {
		canvasRef.current.width = width
		canvasRef.current.height = height
		context.drawImage(videoRef.current, 0, 0, width, height)

		// imageData = canvasRef.current.toDataURL('image/png')

		// photoRef.current.setAttribute('src', imageData)
	} else {
		clearPhoto(canvasRef)
	}
}

function startup(videoRef) {
	// navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { exact: "environment" } } }).then(function (stream) {
	// 	videoRef.current.srcObject = stream
	// 	videoRef.current.play()
	// })

	// const supports = navigator.mediaDevices.getSupportedConstraints();
	// if (!supports['facingMode']) {
	// 	alert('This browser does not support facingMode!');
	// }

	const options = {
		audio: false,
		video: {
			facingMode: 'environment' //'user', // Or 'environment'
		}
	}

	navigator.mediaDevices.getUserMedia(options).then(function (stream) {
		videoRef.current.srcObject = stream
		videoRef.current.play()
	})
}

interface ScanImagePanelProps {
	onClose?: () => void
	isLoaded?: (loaded: boolean) => void
}

export const ScanImagePanel: StandardFC<ScanImagePanelProps> = memo(function ScanFormPanelBody({}) {
	const videoRef = useRef(null)
	const canvasRef = useRef(null)
	const [isImageTaken, setImageTakenState] = useState<boolean>(false)
	const { t } = useTranslation(Namespace.Scan)
	const cancelTakePhoto = useNavCallback(ApplicationRoute.ScanManager)

	const turnOffCamera = (videoRef) => {
		const videoObj = videoRef.current.srcObject
		const tracks = videoObj.getTracks()
		if (tracks) {
			streaming = false
			videoRef.current.pause()
			tracks.forEach((track) => track.stop())
			videoRef.current.srcObject = null
		}
	}

	const turnCameraOn = () => {
		setVideoSize(videoRef)
		setImageTakenState(false)
	}

	const close = () => {
		turnOffCamera(videoRef)
		cancelTakePhoto()
	}
	const photoTaken = () => {
		takePicture(videoRef, canvasRef)
		videoRef.current.pause()
		videoRef.current.setAttribute('width', 0)
		videoRef.current.setAttribute('height', 0)
		setImageTakenState(true)
	}

	const turnOnFlash = () => {}

	startup(videoRef)
	useVideo(videoRef, canvasRef)

	const videoStyle = {
		display: isImageTaken ? 'none' : 'block'
	}
	const imageStyle = {
		display: isImageTaken ? 'block' : 'none'
	}
	return (
		<>
			<div className={cx(styles.takePhotoTopButtonContainer)}>
				<DefaultButton
					style={videoStyle}
					onClick={() => {
						close()
					}}
					text={t('scanImage.cancelButton')}
				/>
				<DefaultButton
					style={videoStyle}
					disabled={true}
					onClick={() => {
						turnOnFlash()
					}}
					text={t('scanImage.turnOnFlashButton')}
				/>
			</div>
			<div className={cx(styles.photoContainer)}>
				{/* 640 */}
				<canvas style={imageStyle} ref={canvasRef} id='canvas' />
				<video ref={videoRef} id='video'>
					<track kind='captions' />
					{t('scanImage.videoStremNotWorking')}
				</video>
			</div>
			{isImageTaken ? (
				<>
					<div className={cx(styles.previewButtonContainer)}>
						<h2>{t('scanImage.previewPhotoText')}</h2>
						<DefaultButton
							style={imageStyle}
							primary={true}
							onClick={() => {
								turnCameraOn()
							}}
							text={t('scanImage.takeMoreButton')}
						/>
						<DefaultButton
							style={imageStyle}
							onClick={() => {
								close()
							}}
							text={t('scanImage.doneUploadButton')}
						/>
					</div>
				</>
			) : (
				<>
					<div className={cx(styles.takePhotoBottomButtonContainer)}>
						<DefaultButton
							style={videoStyle}
							onClick={() => {
								photoTaken()
							}}
							text={t('scanImage.takePhotoButton')}
						/>
					</div>
				</>
			)}
		</>
	)
})
