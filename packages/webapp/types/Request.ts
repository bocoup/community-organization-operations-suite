/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import Identifier from './Identifier'
import Requester from './Requester'

export default interface RequestType {
	requester: Requester
	identifiers: Identifier[]
}
