/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import NextErrorComponent from 'next/error'

const NotFoundPage = () => {
	return <NextErrorComponent statusCode={404} title='Page not found' />
}

export default NotFoundPage
