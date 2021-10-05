/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { LoginLayout } from '~layouts/LoginLayout'
import { PasswordResetForm } from '~components/forms/PasswordResetForm'
import { LoginPageBody } from '~components/ui/LoginPageBody'
import { wrap } from '~utils/appinsights'

const PasswordResetPage = wrap(function PasswordResetPage(): JSX.Element {
	return (
		<LoginLayout>
			<LoginPageBody>
				<PasswordResetForm />
			</LoginPageBody>
		</LoginLayout>
	)
})

export default PasswordResetPage
