/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import cx from 'classnames'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import styles from './index.module.scss'
import TagList from '~lists/TagList'
import type ComponentProps from '~types/ComponentProps'
import ContactInfo from '~ui/ContactInfo'
import type { Engagement } from '@cbosuite/schema/dist/client-types'
import { memo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { useLocale } from '~hooks/useLocale'

interface RequestHeaderProps extends ComponentProps {
	title?: string
	request?: Engagement
}

const RequestHeader = memo(function RequestHeader({ request }: RequestHeaderProps): JSX.Element {
	const { t } = useTranslation('requests')
	const [locale] = useLocale()

	if (!request?.contacts) {
		return null
	}

	const { contacts, tags } = request
	const {
		name: { first, last },
		address,
		email,
		phone,
		dateOfBirth
	} = contacts[0]

	return (
		<div className={cx(styles.requestHeaderWrapper)}>
			<div className='mb-5'>
				<h3 className='mb-2'>
					{first} {last}
				</h3>
				<h5>
					{t('viewRequest.header.dateOfBirth')}:{' '}
					{new Intl.DateTimeFormat(locale).format(new Date(dateOfBirth))}
				</h5>
			</div>

			<Row className='no-gutters flex-column flex-md-row'>
				<Col className='mb-2 mb-md-0'>
					<>
						<h5 className='mb-2'>{t('viewRequest.header.contact')}</h5>
						<ContactInfo contact={{ email, phone, address }} />
					</>
				</Col>
				<Col>
					<>
						<h5 className='mb-2'>{t('viewRequest.header.identifiers')}</h5>
						<TagList tags={tags} light />
					</>
				</Col>
			</Row>
			<div className='d-flex justify-content-between'>
				<div></div>
			</div>
		</div>
	)
})
export default RequestHeader
