/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/**
 * Default arguments used for loading data in redux slices
 */
export default interface LoadActionProps {
	id?: string | number | string[] | number[]
	callback?: () => void
}
