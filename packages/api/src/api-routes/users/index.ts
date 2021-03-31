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
	description: 'Retrieve a list of users',
	tags: ['users'],
	operationId: 'getUsers',
	responses: {
		default: {
			description: 'Unexpected error',
			schema: {
				$ref: '#/definitions/Error',
			},
		},
	},
}

export const POST: Operation = [
	async (req: Request, res: Response) => {
		res.status(201).json([
			{
				id: '123',
			},
		])
	},
]
POST.apiDoc = {
	description: 'Create a new user',
	tags: ['users'],
	operationId: 'createUser',
	parameters: [],
	responses: {
		default: {
			description: 'Unexpected error',
			schema: {
				$ref: '#/definitions/Error',
			},
		},
	},
}
