/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import MyDataLayout from '~components/layouts/MyDataLayout'
import getServerSideTranslations from '~utils/getServerSideTranslations'

export const getStaticProps = getServerSideTranslations(['common', 'footer'])

const MyDataPage = memo(function MyDataPage(): JSX.Element {
	return (
		<MyDataLayout documentTitle={'Manage My Data'}>
			<div>hello</div>
		</MyDataLayout>
	)
})

export default MyDataPage
