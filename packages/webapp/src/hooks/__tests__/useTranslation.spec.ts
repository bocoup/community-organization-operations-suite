/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { defineMessages } from 'react-intl'

describe('The useTranslation hook', () => {
	it('can localize messages', () => {
		const localizations = require('../../../public/localizations/es-US.json')
		expect(localizations).toBeTruthy()

		const messages = defineMessages(localizations)
		expect(messages).toBeTruthy()

		expect(messages.common.app.title).toBe('Resolve')
		expect(messages.common['personaTitle']).toBe('Hola, [[firstName]]')
	})
})
