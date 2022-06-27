/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FC } from 'react'
import { memo, useEffect, useState, useCallback } from 'react'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { AddClientForm } from '~components/forms/AddClientForm'
import { Panel } from '~components/ui/Panel'
import { useBoolean } from '@fluentui/react-hooks'
import { AddRequestForm } from '~forms/AddRequestForm'
import { QuickActionsPanelBody } from '~components/ui/QuickActionsPanelBody'
import { ServiceListPanelBody } from '~components/ui/ServiceListPanelBody'
import { noop } from '~utils/noop'

interface NewFormPanelProps {
	showNewFormPanel?: boolean
	newFormPanelName?: string
	newClientName?: string
	onNewFormPanelSubmit?: (values: any, formName?: string) => void
	onNewFormPanelDismiss?: () => void
	kioskMode?: boolean
}

export const NewFormPanel: FC<NewFormPanelProps> = memo(function NewFormPanel({
	showNewFormPanel = false,
	newFormPanelName,
	newClientName,
	onNewFormPanelSubmit = noop,
	onNewFormPanelDismiss = noop,
	kioskMode = false
}) {
	const [isOpen, { setTrue: open, setFalse: dismiss }] = useBoolean(false)

	const { t: clientT } = useTranslation(Namespace.Clients)
	const [nameState, setNameState] = useState(newFormPanelName)

	const handleDismiss = useCallback(() => {
		dismiss()
		onNewFormPanelDismiss()
	}, [dismiss, onNewFormPanelDismiss])

	const handleSubmit = useCallback(
		(values: any) => {
			onNewFormPanelSubmit(values, nameState)
			handleDismiss()
		},
		[onNewFormPanelSubmit, handleDismiss, nameState]
	)

	const handleQuickActionsButton = useCallback(
		(buttonName: string) => {
			setNameState(buttonName)
		},
		[setNameState]
	)

	const renderNewFormPanel = useCallback(
		(formName: string): JSX.Element => {
			switch (formName) {
				case 'addClientForm':
					return (
						<AddClientForm
							title={clientT('clientAddButton')}
							name={newClientName}
							closeForm={handleDismiss}
						/>
					)
				case 'addRequestForm':
					return <AddRequestForm onSubmit={handleSubmit} />
				case 'quickActionsPanel':
					return <QuickActionsPanelBody onButtonClick={handleQuickActionsButton} />
				case 'startServiceForm':
					return <ServiceListPanelBody />
				default:
					return null
			}
		},
		[clientT, handleDismiss, handleSubmit, handleQuickActionsButton, newClientName]
	)

	useEffect(() => {
		setNameState(newFormPanelName)
		if (showNewFormPanel) {
			open()
		} else {
			dismiss()
		}
	}, [showNewFormPanel, newFormPanelName, open, dismiss])

	return (
		<Panel openPanel={isOpen} kioskMode={kioskMode} onDismiss={handleDismiss}>
			{nameState && renderNewFormPanel(nameState)}
		</Panel>
	)
})
