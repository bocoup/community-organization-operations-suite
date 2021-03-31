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
	description: 'Retrieve a user by id',
	tags: ['users'],
	operationId: 'getUserById',
	parameters: [
		{
			in: 'path',
			name: 'userId',
			type: 'string',
			required: true,
		},
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
