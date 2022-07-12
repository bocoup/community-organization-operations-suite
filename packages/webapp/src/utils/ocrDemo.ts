/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * Demo Code
 * Needs to be clean up in next sprint
 */

const requestOcrData = async (file) => {
	const formdata = new FormData()
	formdata.append('file', file)

	const requestOptions = {
		method: 'POST',
		body: formdata
	}
	return fetch('https://cbo-ops-suite.azurewebsites.net/api/ocr', requestOptions)
}

const scanFile = async (file) => {
	const result = await Promise.all([requestOcrData(file).then((result) => result.json())])
	return result[0]
}

export default scanFile
