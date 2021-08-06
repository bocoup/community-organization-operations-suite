/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// import path from 'path'

/**
 * Funciton to add static path for non-development environments
 *
 * @param staticPath path of static content
 * @returns string path of assset
 */
const getStatic = (staticPath: string): string => {
	// if (process.env.NODE_ENV !== 'development') return path.join('static', staticPath)
	// else return staticPath
	return staticPath
}

export default getStatic
