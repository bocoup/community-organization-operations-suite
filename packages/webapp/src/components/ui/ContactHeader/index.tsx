/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import styles from './index.module.scss'
import type ComponentProps from '~types/ComponentProps'
import ContactInfo from '~ui/ContactInfo'
import type { Contact } from '@resolve/schema/lib/client-types'
import { memo } from 'react'
import TagList from '~components/lists/TagList'
import { useTranslation } from '~hooks/useTranslation'

interface RequestHeaderProps extends ComponentProps {
	title?: string
	contact?: Contact
}

const RequestHeader = memo(function RequestHeader({ contact }: RequestHeaderProps): JSX.Element {
	const { t } = useTranslation('clients')
	if (!contact) {
		return null
	}

	const {
		name: { first, middle, last },
		address,
		email,
		phone,
		dateOfBirth
	} = contact

	const attributes = contact.attributes.map(a => {
		return {
			id: a.id,
			label: a.label
		}
	})

	return (
		<div className={cx(styles.requestHeaderWrapper)}>
			<div className='mb-5'>
				<h3 className='mb-2'>
					{first} {middle} {last}
				</h3>
				<h5>
					{t('viewClient.header.dateOfBirth')}:{' '}
					{new Intl.DateTimeFormat('en-US').format(new Date(dateOfBirth))}
				</h5>
			</div>

			<Row className='no-gutters flex-column flex-md-row'>
				<Col className='mb-2 mb-md-0'>
					<>
						<h5 className='mb-2'>{t('viewClient.header.contact')}</h5>
						<ContactInfo contact={{ email, phone, address }} />
					</>
				</Col>
				<Col>
					{attributes.length > 0 && (
						<>
							<h5 className='mb-2'>{t('viewClient.header.attributes')}</h5>
							<TagList tags={attributes} light />
						</>
					)}
				</Col>
			</Row>
			<div className='d-flex justify-content-between'>
				<div></div>
			</div>
		</div>
	)
})
export default RequestHeader
