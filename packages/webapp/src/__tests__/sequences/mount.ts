/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { act } from 'react-dom/test-utils'
import { waitFor } from '@testing-library/react'
import { mount as mountApp } from '../../mount'

export async function mount(container: Element) {
	await act(async () => {
		mountApp()
		await waitFor(() => {
			expect(container.innerHTML.length).toBeGreaterThan(0)
		})
	})
}
