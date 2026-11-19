const crypto = require('crypto')
const express = require('express')
const jwt = require('jsonwebtoken')

const NOMBRE_COOKIE = 'gekokoj_sesion'
const DURACION_SESION_MS = 8 * 60 * 60 * 1000 // 8 horas
const DURACION_TOKEN = '8h'

function credencialesAdmin() {
	return {
		usuario: process.env.ADMIN_USUARIO,
		clave: process.env.ADMIN_CLAVE,
		secreto: process.env.JWT_SECRETO
	}
}

function credencialesConfiguradas() {
	const { usuario, clave, secreto } = credencialesAdmin()
	return Boolean(usuario && clave && secreto)
}

// Comparación en tiempo constante para no filtrar pistas por el tiempo de respuesta.
function esCredencialValida(valor, esperado) {
	if (typeof valor !== 'string' || typeof esperado !== 'string') {
		return false
	}

	const bufferRecibido = Buffer.from(valor)
	const bufferEsperado = Buffer.from(esperado)

	if (bufferRecibido.length !== bufferEsperado.length) {
		return false
	}

	return crypto.timingSafeEqual(bufferRecibido, bufferEsperado)
}

function leerCookies(req) {
	const cabecera = req.headers.cookie

	if (!cabecera) {
		return {}
	}

	return cabecera.split(';').reduce((cookies, fragmento) => {
		const indice = fragmento.indexOf('=')

		if (indice === -1) {
			return cookies
		}

		const nombre = fragmento.slice(0, indice).trim()
		cookies[nombre] = fragmento.slice(indice + 1).trim()
		return cookies
	}, {})
}

function leerTokenSesion(req) {
	return leerCookies(req)[NOMBRE_COOKIE] || null
}

function firmarToken() {
	const { secreto } = credencialesAdmin()
	return jwt.sign({ rol: 'admin' }, secreto, { expiresIn: DURACION_TOKEN })
}

function establecerSesionCookie(res, token) {
	const enProduccion = process.env.NODE_ENV === 'production'

	res.cookie(NOMBRE_COOKIE, token, {
		httpOnly: true,
		secure: enProduccion,
		sameSite: 'lax',
		path: '/',
		maxAge: DURACION_SESION_MS
	})
}

const router = express.Router()

// POST: iniciar sesión como administrador
router.post('/login', (req, res) => {
	const { usuario, contrasenia } = req.body || {}

	if (!credencialesConfiguradas()) {
		return res.status(500).json({
			error: 'El panel no está configurado: faltan ADMIN_USUARIO, ADMIN_CLAVE o JWT_SECRETO'
		})
	}

	const credenciales = credencialesAdmin()
	const sesionValida = (
		esCredencialValida(usuario, credenciales.usuario) &&
		esCredencialValida(contrasenia, credenciales.clave)
	)

	if (!sesionValida) {
		return res.status(401).json({ error: 'Usuario o contraseña incorrectos' })
	}

	establecerSesionCookie(res, firmarToken())
	res.json({ mensaje: 'Sesión iniciada correctamente' })
})

// POST: cerrar sesión
router.post('/logout', (req, res) => {
	res.clearCookie(NOMBRE_COOKIE, { path: '/' })
	res.json({ mensaje: 'Sesión cerrada correctamente' })
})

// GET: comprobar si hay una sesión activa
router.get('/sesion', (req, res) => {
	const token = leerTokenSesion(req)
	const { secreto } = credencialesAdmin()

	if (!token || !secreto) {
		return res.status(401).json({ autenticado: false })
	}

	try {
		jwt.verify(token, secreto)
		res.json({ autenticado: true })
	} catch {
		res.status(401).json({ autenticado: false })
	}
})

// Middleware para rutas de escritura del catálogo (POST, PUT, DELETE)
function protegerEscritura(req, res, next) {
	const token = leerTokenSesion(req)
	const { secreto } = credencialesAdmin()

	if (!token || !secreto) {
		return res.status(401).json({
			error: 'Debes iniciar sesión como administrador para modificar productos'
		})
	}

	try {
		jwt.verify(token, secreto)
		next()
	} catch {
		return res.status(401).json({ error: 'Tu sesión expiró. Inicia sesión nuevamente' })
	}
}

module.exports = { router, protegerEscritura }
