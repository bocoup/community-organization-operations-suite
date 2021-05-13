/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IncomingMessage, ServerResponse } from 'http'
import { UrlWithParsedQuery } from 'url'
import next from 'next'
import { Configuration } from './Configuration'

/**
 * Prepares Next.JS app server
 * https://nextjs.org/docs/advanced-features/custom-server
 * @param config The app configuration
 * @returns The Next.JS app handler
 */
export async function getNextHandler({
	isDevMode: dev
}: Configuration): Promise<
	(req: IncomingMessage, res: ServerResponse, parsedUrl?: UrlWithParsedQuery) => Promise<any>
> {
	const app = next({ dev })
	const handle = app.getRequestHandler()
	await app.prepare()
	return handle
}
