/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Store } from 'react-stores'

export const currentUserStore = new Store({
	username: '',
	sessionPassword: ''
})
