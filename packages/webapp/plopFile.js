/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const pageExists = require('./plop_templates/lib/pageExists')

module.exports = plop => {
	// Component generator
	// TODO: add prompts to specify where to create the component (e.g. ui/forms/layouts/modals)
	plop.setGenerator('component', {
		description: 'Generate component',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'What should it be called?',
				validate: value => {
					if (/.+/.test(value)) {
						return pageExists(value) ? 'A component with this name already exists' : true
					}

					return 'The name is required'
				}
			},
			{
				type: 'list',
				name: 'componentType',
				message: 'What type of component is this?',
				choices: [
					{ name: 'UI', value: 'ui' },
					{ name: 'Form', value: 'forms' },
					{ name: 'Modal', value: 'modals' },
					{ name: 'List', value: 'lists' },
					{ name: 'Layout', value: 'layouts' }
				],
				default: 0
			}
		],
		actions: () => {
			const actions = [
				{
					type: 'add',
					path: './components/{{componentType}}/{{properCase name}}/index.tsx',
					templateFile: './plop_templates/Component/index.tsx.hbs',
					abortOnFail: true
				},
				{
					type: 'add',
					path: './components/{{componentType}}/{{properCase name}}/index.module.scss',
					templateFile: './plop_templates/Component/index.module.scss.hbs',
					abortOnFail: true
				}
			]
			return actions
		}
	})

	// Redux slice generator
	// TODO: add modify action to add reducer to rootReducer (in ~store/index.ts)
	plop.setGenerator('slice', {
		description: 'Generate redux Slice',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'What should it be called?',
				validate: value => {
					if (/.+/.test(value)) {
						return pageExists(value) ? 'A component with this name already exists' : true
					}

					return 'The name is required'
				}
			}
		],
		actions: () => {
			const actions = [
				{
					type: 'add',
					path: './store/slices/{{camelCase name}}.ts',
					templateFile: './plop_templates/slice.ts.hbs',
					abortOnFail: true
				}
			]
			return actions
		}
	})

	// Type generator
	plop.setGenerator('type', {
		description: 'Generate type',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'What should it be called?',
				validate: value => {
					if (/.+/.test(value)) {
						return pageExists(value) ? 'A type with this name already exists' : true
					}

					return 'The name is required'
				}
			}
		],
		actions: () => {
			const actions = [
				{
					type: 'add',
					path: './types/{{properCase name}}.ts',
					templateFile: './plop_templates/type.ts.hbs',
					abortOnFail: true
				}
			]
			return actions
		}
	})

	// Page generator
	plop.setGenerator('page', {
		description: 'Generate new page',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'What should it be called?',
				validate: value => {
					if (/.+/.test(value)) {
						return pageExists(value) ? 'A page with this name already exists' : true
					}

					return 'The name is required'
				}
			},
			{
				type: 'confirm',
				name: 'container',
				message: 'Is this a container component?',
				default: true
			},
			{
				type: 'confirm',
				name: 'useState',
				default: false,
				message: 'Do you want to use state in this page?'
			}
		],
		actions: () => {
			const actions = [
				{
					type: 'add',
					path: './pages/{{dashCase name}}.tsx',
					templateFile: './plop_templates/Page.tsx.hbs',
					abortOnFail: true
				}
			]
			return actions
		}
	})

	// Utils generator
	plop.setGenerator('util', {
		description: 'Generate new page',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'What should it be called?',
				validate: value => {
					if (/.+/.test(value)) {
						return pageExists(value) ? 'A page with this name already exists' : true
					}

					return 'The name is required'
				}
			}
		],
		actions: () => {
			const actions = [
				{
					type: 'add',
					path: './utils/{{camelCase name}}.ts',
					templateFile: './plop_templates/util.ts.hbs',
					abortOnFail: true
				}
			]
			return actions
		}
	})
}
