/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FC, memo } from 'react'
import { ReportType } from '../types'
import { ClientReport } from './ClientReport'
import { ServiceReport } from './ServiceReport'
import { CommonReportProps } from './types'

export const Report: FC<{ type: ReportType } & CommonReportProps> = memo(function Report({
	type,
	service,
	...props
}) {
	switch (type) {
		case ReportType.CLIENTS:
			return <ClientReport {...props} />
		case ReportType.SERVICES:
			return service == null ? null : <ServiceReport service={service} {...props} />
		default:
			return null
	}
})
