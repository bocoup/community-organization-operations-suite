/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Authenticator } from '../Authenticator'

export abstract class BaseOrgAuthEvaluationStrategy {
	public constructor(protected authenticator: Authenticator) {}
}
