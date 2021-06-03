export default (a: { date: string }, b: { date: string }) => {
	const aDate = new Date(a.date)
	const bDate = new Date(b.date)
	return bDate.getTime() - aDate.getTime()
}
