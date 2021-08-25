/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { defineMessages } from 'react-intl'

describe('The useTranslation hook', () => {
	it('can derp', () => {
		const localizations = require('../../../public/localizations/es-US.json')
		expect(localizations).toBeDefined()

		const messages = defineMessages(localizations)
		expect(messages).toBeDefined()

		expect(messages.common.app.title).toEqual('Resolve')
		expect(messages.common['personaTitle']).toEqual('Hola, [[firstName]]')
	})
})
