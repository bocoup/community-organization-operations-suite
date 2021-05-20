/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FontIcon } from '@fluentui/react'
import type ComponentProps from '~types/ComponentProps'
import type ContactInfoType from '~types/ContactInfo'

interface ContactInfoProps extends ComponentProps {
	contact?: ContactInfoType
}

export default function ContactInfo({ contact }: ContactInfoProps): JSX.Element {
	if (!contact) return null

	const { email, phone, street, city, state, zip } = contact

	return (
		<>
			{/* TODO: replace format with proper util */}
			{phone && (
				<span className='d-flex align-items-center mb-2'>
					<FontIcon iconName='CellPhone' className='me-3' />
					<a href={`tel:${phone}`}>
						{phone
							.toString()
							.replace(/\D+/g, '')
							.replace(/(\d{3})(\d{3})(\d{4})/, '$1.$2.$3')}
					</a>
				</span>
			)}
			{email && (
				<span className='d-flex align-items-center mb-2'>
					<FontIcon iconName='Mail' className='me-3' />
					<a href={`mailto:${email}`}>{email}</a>
				</span>
			)}
			{street && (
				<span className='d-flex align-items-start mb-2'>
					<FontIcon iconName='POI' className='me-3' />
					<div>
						<div>{street}</div>
						<div>
							{city && `${city}, `}
							{state && `${state}, `}
							{zip && zip.toString()}
						</div>
					</div>
				</span>
			)}
		</>
	)
}
