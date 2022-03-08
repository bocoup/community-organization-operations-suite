/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FC } from 'react'
import { memo } from 'react'
import { ReportType } from '../types'
import { ClientReport } from './ClientReport'
import { RequestReport } from './RequestReport'
import { ServiceReport } from './ServiceReport'
import type { CommonReportProps } from './types'

export const Report: FC<{ type: ReportType } & CommonReportProps> = memo(function Report({
	type,
	service,
	...props
}) {
	switch (type) {
		case ReportType.CLIENTS:
			return <ClientReport {...props} />
		case ReportType.REQUESTS:
			return <RequestReport {...props} />
		case ReportType.SERVICES:
			return service == null ? null : <ServiceReport service={service} {...props} />
		default:
			return null
	}
})
