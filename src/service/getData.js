import fetch from './fetch'
export const getAllListen = (source,page,limit = 20) => fetch('/api/v1/qly/hot', {
	source,
	page,
	limit
});