/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
//import SpecialistLayout from '~components/layouts/SpecialistLayout'
//import ShortString from '~components/ui/ShortString'
import { fakeSpecialists } from '~slices/navigatorsSlice'
import Specialist from '~types/Specialist'
//import CRC from '~ui/CRC'
//import SpecialistHeader from '~ui/SpecialistHeader'

export default function Profile(): JSX.Element {
	const router = useRouter()
	const { sid } = router.query as { sid: string }
	// TODO: replace with reducer

	const [specialist, setSpecialist] = useState<Specialist | undefined>()
	// const specialist = useSelector(getRequest)

	// TODO: replace with graphql
	useEffect(() => {
		// Rid only present after page mounts
		if (sid) {
			// dispatch(loadRequest({ id: sid }))
			setSpecialist(fakeSpecialists[parseInt(sid) - 1])
		}
	}, [sid])

	// TODO: render empty state
	if (!specialist) {
		return null
	}

	//const { bio, trainingAndAchievements } = specialist

	return (
		<></>
		// <SpecialistLayout specialist={specialist}>
		// 	<section className='w-100 bg-light'>
		// 		<CRC size='sm'>
		// 			<SpecialistHeader specialist={specialist} />
		// 		</CRC>
		// 	</section>
		// 	<section className='pt-3 pt-md-5 mb-3 mb-lg-5'>
		// 		<CRC size='sm'>
		// 			{/* Bio */}
		// 			<div className='mb-3 mb-lg-5'>
		// 				{/* TODO: get string from localizations */}
		// 				<h3 className='mb-2 mb-lg-4 '>
		// 					<strong>Bio</strong>
		// 				</h3>
		// 				<ShortString text={bio} limit={240} />
		// 			</div>

		// 			{/* Training and Achievements */}
		// 			{trainingAndAchievements && (
		// 				<div className='mb-3 mb-lg-5'>
		// 					{/* TODO: get string from localizations */}
		// 					<h3 className='mb-2 mb-lg-4 '>
		// 						<strong>Training / Achievments</strong>
		// 					</h3>
		// 					<ShortString text={trainingAndAchievements} limit={240} />
		// 				</div>
		// 			)}
		// 		</CRC>
		// 	</section>
		// </SpecialistLayout>
	)
}
