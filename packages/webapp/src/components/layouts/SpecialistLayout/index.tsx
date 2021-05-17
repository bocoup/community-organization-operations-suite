/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import DefaultLayout from '~layouts/Default'
import type ComponentProps from '~types/ComponentProps'
import Specialist from '~types/Specialist'
import ActionBar from '~ui/ActionBar'
import ActionBarStatusTag from '~ui/ActionBarStatusTag'

// TODO: Change request to come from store
interface SpecialistLayoutProps extends ComponentProps {
	title?: string
	specialist?: Specialist
}

export default function SpecialistLayout({
	title,
	children,
	specialist
}: SpecialistLayoutProps): JSX.Element {
	return (
		<DefaultLayout>
			<ActionBar size='sm' showBack>
				{specialist && <ActionBarStatusTag status={specialist.status} />}
			</ActionBar>

			<>{children}</>
		</DefaultLayout>
	)
}
