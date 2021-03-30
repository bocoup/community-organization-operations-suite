/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Request, Response } from 'express'
import { Operation } from 'express-openapi'

export const GET: Operation = [
	async (req: Request, res: Response) => {
		res.json([
			{
				id: '123',
			},
		])
	},
]
GET.apiDoc = {
	description: 'Retrieve a list of contacts',
	tags: ['eligibility'],
	operationId: 'getEligibility',
	parameters: [
		// {
		// 	in: 'query',
		// 	name: 'lat',
		// 	type: 'number',
		// 	format: 'double',
		// 	required: true,
		// },
		// {
		// 	in: 'query',
		// 	name: 'long',
		// 	type: 'number',
		// 	format: 'double',
		// 	required: true,
		// },
		// {
		// 	in: 'query',
		// 	name: 'localization',
		// 	type: 'string',
		// },
	],
	responses: {
		default: {
			description: 'Unexpected error',
			schema: {
				$ref: '#/definitions/Error',
			},
		},
	},
}
