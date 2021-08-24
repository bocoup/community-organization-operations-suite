/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import LoginLayout from '~layouts/LoginLayout'
import PasswordResetForm from '~components/forms/PasswordResetForm'

const PasswordResetPage = memo(function PasswordResetPage(): JSX.Element {
	return (
		<LoginLayout>
			<PasswordResetForm />
		</LoginLayout>
	)
})

export default PasswordResetPage
