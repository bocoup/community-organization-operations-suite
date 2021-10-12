/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { isChrome, isSafari } from './useragent'

/* NOTE: adapted from https://github.com/PixelsCommander/Download-File-JS */

export function downloadFile(url: string) {
	// iOS devices do not support downloading. We have to inform user about this.
	if (/(iP)/g.test(navigator.userAgent)) {
		alert('Your device does not support files downloading. Please try again in desktop browser.')
		return false
	}

	//If in Chrome or Safari - download via virtual link click
	if (isChrome() || isSafari()) {
		//Creating new link node.
		const link = document.createElement('a')
		link.href = url

		if (link.download !== undefined) {
			//Set HTML5 download attribute. This will prevent file from opening if supported.
			const fileName = url.substring(url.lastIndexOf('/') + 1, url.length)
			link.download = fileName
		}

		//Dispatching click event.
		if (document.createEvent) {
			const e = new MouseEvent('click', {
				view: window,
				bubbles: true,
				cancelable: true
			})
			link.dispatchEvent(e)
			return true
		}
	}

	// Force file download (whether supported by server).
	if (url.indexOf('?') === -1) {
		url += '?download'
	}

	window.open(url, '_self')
	return true
}
