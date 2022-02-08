/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	applyStringFilterValue,
	applyMultipleChoiceFilterValues,
	applyMultiStringFilterValue,
	applyDateFilter,
	applyNumberFilter,
	applyOptionsFilter
} from '../filters'

const createData = (): any[] => {
	return [
		{ first: 'aaa', second: 'bbb', third: ['vvv', 'xxx'] },
		{ first: 'bbb', second: 'eee', third: ['zzz', 'ttt'] },
		{ first: 'ccc', second: 'bbb', third: ['VVV', 'qqq'] },
		{ first: 'AAA', second: 'ddd', third: ['yyy', 'rrr'] }
	]
}

const createDateData = (): any[] => {
	return [
		{ first: 'aaa', second: 'bbb', time: '2001-01-01 11:00', third: ['vvv', 'xxx'] },
		{ first: 'bbb', second: 'eee', time: '2002-02-02 11:00', third: ['zzz', 'ttt'] },
		{ first: 'ccc', second: 'bbb', time: '2003-03-03 11:00', third: ['VVV', 'qqq'] },
		{ first: 'AAA', second: 'ddd', time: '2004-04-04 11:00', third: ['yyy', 'rrr'] }
	]
}

const createNumberData = (): any[] => {
	return [
		{ first: 'aaa', second: 'bbb', value: 3, third: ['vvv', 'xxx'] },
		{ first: 'bbb', second: 'eee', value: 2, third: ['zzz', 'ttt'] },
		{ first: 'ccc', second: 'bbb', value: 4, third: ['VVV', 'qqq'] },
		{ first: 'AAA', second: 'ddd', value: 1, third: ['yyy', 'rrr'] }
	]
}

describe('The string filtering', () => {
	it('will return matching records', () => {
		const values = [
			{ first: 'aaa', second: 'bbb' },
			{ first: 'bbb', second: 'eee' },
			{ first: 'ccc', second: 'bbb' },
			{ first: 'AAA', second: 'ddd' }
		]
		const filtered = applyStringFilterValue('aaa', values, (val) => val.first)
		expect(filtered).toHaveLength(2)
		expect(filtered[0]).toStrictEqual({ first: 'aaa', second: 'bbb' })
		expect(filtered[1]).toStrictEqual({ first: 'AAA', second: 'ddd' })
	})
	it('will return an empty list if no records', () => {
		const values = [
			{ first: 'aaa', second: 'bbb' },
			{ first: 'bbb', second: 'eee' },
			{ first: 'ccc', second: 'bbb' },
			{ first: 'AAA', second: 'ddd' }
		]
		const filtered = applyStringFilterValue('ggg', values, (val) => val.first)
		expect(filtered).toHaveLength(0)
	})
	it('will return the whole list if no filter specified', () => {
		const values = [
			{ first: 'aaa', second: 'bbb' },
			{ first: 'bbb', second: 'eee' },
			{ first: 'ccc', second: 'bbb' },
			{ first: 'AAA', second: 'ddd' }
		]
		const filtered = applyStringFilterValue('   ', values, (val) => val.first)
		expect(filtered).toHaveLength(4)
	})
})

describe('The multiple choice filtering', () => {
	it('will return matching records when filtering on a single field', () => {
		const values = createData()
		const filtered = applyMultipleChoiceFilterValues(['aaa'], values, (val) => val.first)
		expect(filtered).toHaveLength(2)
		expect(filtered[0]).toStrictEqual({ first: 'aaa', second: 'bbb', third: ['vvv', 'xxx'] })
		expect(filtered[1]).toStrictEqual({ first: 'AAA', second: 'ddd', third: ['yyy', 'rrr'] })
		const filteredMulti = applyMultipleChoiceFilterValues(
			['aaa', 'ccc'],
			values,
			(val) => val.first
		)
		expect(filteredMulti).toHaveLength(3)
		expect(filteredMulti[0]).toStrictEqual({ first: 'aaa', second: 'bbb', third: ['vvv', 'xxx'] })
		expect(filteredMulti[1]).toStrictEqual({ first: 'ccc', second: 'bbb', third: ['VVV', 'qqq'] })
		expect(filteredMulti[2]).toStrictEqual({ first: 'AAA', second: 'ddd', third: ['yyy', 'rrr'] })
	})
	it('will return matching records when filtering on an array field', () => {
		const values = createData()
		const filtered = applyMultipleChoiceFilterValues(['vvv'], values, (val) => val.third)
		expect(filtered).toHaveLength(2)
		expect(filtered[0]).toStrictEqual({ first: 'aaa', second: 'bbb', third: ['vvv', 'xxx'] })
		expect(filtered[1]).toStrictEqual({ first: 'ccc', second: 'bbb', third: ['VVV', 'qqq'] })
		const filteredMulti = applyMultipleChoiceFilterValues(
			['vvv', 'yyy'],
			values,
			(val) => val.third
		)
		expect(filteredMulti).toHaveLength(3)
		expect(filteredMulti[0]).toStrictEqual({ first: 'aaa', second: 'bbb', third: ['vvv', 'xxx'] })
		expect(filteredMulti[1]).toStrictEqual({ first: 'ccc', second: 'bbb', third: ['VVV', 'qqq'] })
		expect(filteredMulti[2]).toStrictEqual({ first: 'AAA', second: 'ddd', third: ['yyy', 'rrr'] })
	})
	it('will return an empty list if no records when multiple filter', () => {
		const values = createData()
		const filtered = applyMultipleChoiceFilterValues(['www', 'uuu'], values, (val) => val.third)
		expect(filtered).toHaveLength(0)
	})
	it('will return the whole list if no filter specified when multiple filter', () => {
		const values = createData()
		const filtered = applyMultipleChoiceFilterValues([], values, (val) => val.first)
		expect(filtered).toHaveLength(4)
	})
})

describe('The multiple string filtering', () => {
	it('will return matching records when filtering on an array field', () => {
		const values = createData()
		const filtered = applyMultiStringFilterValue('vvv', values, (val) => val.third)
		expect(filtered).toHaveLength(2)
		expect(filtered[0]).toStrictEqual({ first: 'aaa', second: 'bbb', third: ['vvv', 'xxx'] })
		expect(filtered[1]).toStrictEqual({ first: 'ccc', second: 'bbb', third: ['VVV', 'qqq'] })
	})
	it('will return an empty list if no records when multiple filter', () => {
		const values = createData()
		const filtered = applyMultiStringFilterValue('www', values, (val) => val.third)
		expect(filtered).toHaveLength(0)
	})
	it('will return the whole list if no filter specified when multiple filter', () => {
		const values = createData()
		const filtered = applyMultiStringFilterValue('   ', values, (val) => val.first)
		expect(filtered).toHaveLength(4)
	})
})

describe('The date filtering', () => {
	it('will return matching records when filtering on a single field', () => {
		const values = createDateData()
		const filtered = applyDateFilter('2000-01-01', '2003-01-01', values, (val) => val.time)
		expect(filtered).toHaveLength(2)
		expect(filtered[0]).toStrictEqual({
			first: 'aaa',
			second: 'bbb',
			time: '2001-01-01 11:00',
			third: ['vvv', 'xxx']
		})
		expect(filtered[1]).toStrictEqual({
			first: 'bbb',
			second: 'eee',
			time: '2002-02-02 11:00',
			third: ['zzz', 'ttt']
		})
	})
	it('will use an inclusive range', () => {
		const values = createDateData()
		const filtered = applyDateFilter('2002-02-01', '2003-03-02', values, (val) => val.time)
		expect(filtered).toHaveLength(1)
		expect(filtered[0]).toStrictEqual({
			first: 'bbb',
			second: 'eee',
			time: '2002-02-02 11:00',
			third: ['zzz', 'ttt']
		})
	})
	it('will use an until range if the start date is missing', () => {
		const values = createDateData()
		const filtered = applyDateFilter(null, '2003-03-02', values, (val) => val.time)
		expect(filtered).toHaveLength(2)
		expect(filtered[0]).toStrictEqual({
			first: 'aaa',
			second: 'bbb',
			time: '2001-01-01 11:00',
			third: ['vvv', 'xxx']
		})
		expect(filtered[1]).toStrictEqual({
			first: 'bbb',
			second: 'eee',
			time: '2002-02-02 11:00',
			third: ['zzz', 'ttt']
		})
	})
	it('will use a from range if the end date is missing', () => {
		const values = createDateData()
		const filtered = applyDateFilter('2002-02-01', null, values, (val) => val.time)
		expect(filtered).toHaveLength(3)
		expect(filtered[0]).toStrictEqual({
			first: 'bbb',
			second: 'eee',
			time: '2002-02-02 11:00',
			third: ['zzz', 'ttt']
		})
		expect(filtered[1]).toStrictEqual({
			first: 'ccc',
			second: 'bbb',
			time: '2003-03-03 11:00',
			third: ['VVV', 'qqq']
		})
		expect(filtered[2]).toStrictEqual({
			first: 'AAA',
			second: 'ddd',
			time: '2004-04-04 11:00',
			third: ['yyy', 'rrr']
		})
	})
	it('will return an empty list if no records meet filter requirements', () => {
		const values = createData()
		const filtered = applyDateFilter('2000-01-01', '2000-01-02', values, (val) => val.time)
		expect(filtered).toHaveLength(0)
	})
	it('will return the whole list if no filter specified', () => {
		const values = createData()
		const filtered = applyDateFilter(null, null, values, (val) => val.time)
		expect(filtered).toHaveLength(4)
	})
})

describe('The number filtering', () => {
	it('will return matching records when filtering on a single field', () => {
		const values = createNumberData()
		const filtered = applyNumberFilter(2, 3, values, (val) => val.value)
		expect(filtered).toHaveLength(2)
		expect(filtered[0]).toStrictEqual({
			first: 'aaa',
			second: 'bbb',
			value: 3,
			third: ['vvv', 'xxx']
		})
		expect(filtered[1]).toStrictEqual({
			first: 'bbb',
			second: 'eee',
			value: 2,
			third: ['zzz', 'ttt']
		})
	})
	it('will use a less than or equal range if the start value is missing', () => {
		const values = createNumberData()
		const filtered = applyNumberFilter(null, 3, values, (val) => val.value)
		expect(filtered).toHaveLength(3)
		expect(filtered[0]).toStrictEqual({
			first: 'aaa',
			second: 'bbb',
			value: 3,
			third: ['vvv', 'xxx']
		})
		expect(filtered[1]).toStrictEqual({
			first: 'bbb',
			second: 'eee',
			value: 2,
			third: ['zzz', 'ttt']
		})
		expect(filtered[2]).toStrictEqual({
			first: 'AAA',
			second: 'ddd',
			value: 1,
			third: ['yyy', 'rrr']
		})
	})
	it('will use a greater than or equal range if the end value is missing', () => {
		const values = createNumberData()
		const filtered = applyNumberFilter(3, null, values, (val) => val.value)
		expect(filtered).toHaveLength(2)
		expect(filtered[0]).toStrictEqual({
			first: 'aaa',
			second: 'bbb',
			value: 3,
			third: ['vvv', 'xxx']
		})
		expect(filtered[1]).toStrictEqual({
			first: 'ccc',
			second: 'bbb',
			value: 4,
			third: ['VVV', 'qqq']
		})
	})
	it('will return an empty list if no records meet filter requirements', () => {
		const values = createNumberData()
		const filtered = applyNumberFilter(5, 8, values, (val) => val.value)
		expect(filtered).toHaveLength(0)
	})
	it('will return the whole list if no filter specified', () => {
		const values = createNumberData()
		const filtered = applyNumberFilter(null, null, values, (val) => val.value)
		expect(filtered).toHaveLength(4)
	})
})

describe('The options filtering', () => {
	it('will return matching records when filtering on an array field in a case sensitive manner', () => {
		const values = createData()
		const filtered = applyOptionsFilter(['vvv'], values, (val) => val.third)
		expect(filtered).toHaveLength(1)
		expect(filtered[0]).toStrictEqual({ first: 'aaa', second: 'bbb', third: ['vvv', 'xxx'] })
		const filteredMulti = applyOptionsFilter(['vvv', 'yyy'], values, (val) => val.third)
		expect(filteredMulti).toHaveLength(2)
		expect(filteredMulti[0]).toStrictEqual({ first: 'aaa', second: 'bbb', third: ['vvv', 'xxx'] })
		expect(filteredMulti[1]).toStrictEqual({ first: 'AAA', second: 'ddd', third: ['yyy', 'rrr'] })
	})
	it('will return an empty list if no records when multiple filter', () => {
		const values = createData()
		const filtered = applyOptionsFilter(['www', 'uuu'], values, (val) => val.third)
		expect(filtered).toHaveLength(0)
	})
	it('will return an empty list if no filter specified', () => {
		const values = createData()
		const filtered = applyOptionsFilter([], values, (val) => val.third)
		expect(filtered).toHaveLength(0)
	})
})
