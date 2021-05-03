/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export default interface WindowSize {
	width: number
	height: number
	isSM: boolean
	isMD: boolean
	isLG: boolean
	isXL: boolean
	isXXL: boolean
	isLessThanSM: boolean
	isLessThanMD: boolean
	isLessThanLG: boolean
	isLessThanXL: boolean
	isLessThanXXL: boolean
}
