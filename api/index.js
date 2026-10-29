const backend = require('../backend/server')

module.exports = function handler(req, res) {
	// Vercel rewrites /api/<ruta> to this function and carries the original
	// route in `path`. Restore the Express URL so its /api/productos routes match.
	const url = new URL(req.url, 'http://localhost')
	const ruta = url.searchParams.get('path')

	if (ruta) {
		url.searchParams.delete('path')
		req.url = `/api/${ruta}${url.searchParams.size ? `?${url.searchParams}` : ''}`
	}

	return backend(req, res)
}
