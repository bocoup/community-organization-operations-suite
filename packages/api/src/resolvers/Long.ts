/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable no-self-compare */
import { GraphQLScalarType } from 'graphql'
import { Kind, ASTNode } from 'graphql/language'

const MAX_LONG = Number.MAX_SAFE_INTEGER
const MIN_LONG = Number.MIN_SAFE_INTEGER

function coerceLong(value: string) {
	if (value === '') {
		throw new TypeError('Long cannot represent non 52-bit signed integer value: (empty string)')
	}
	const num = Number(value)
	if (num === num && num <= MAX_LONG && num >= MIN_LONG) {
		if (num < 0) {
			return Math.ceil(num)
		} else {
			return Math.floor(num)
		}
	}
	throw new TypeError('Long cannot represent non 52-bit signed integer value: ' + String(value))
}

function parseLiteral(ast: ASTNode) {
	let num
	if (ast.kind === Kind.INT) {
		num = parseInt((ast as any).value, 10)
		if (num <= MAX_LONG && num >= MIN_LONG) {
			return num
		}
		return null
	}
}

export const Long = new GraphQLScalarType({
	name: 'Long',
	description: 'The `Long` scalar type represents 52-bit integers',
	serialize: coerceLong,
	parseValue: coerceLong,
	parseLiteral: parseLiteral
})
