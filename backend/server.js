require('dotenv').config()

const path = require('path')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { router: rutasProductos } = require('./productos')
const { router: rutasAuth } = require('./autenticacion')

const aplicacion = express()
const puerto = process.env.PORT || 3000

// Orígenes permitidos para el frontend (Vite usa proxy, pero facilita otros clientes)
const origenesPermitidos = process.env.CORS_ORIGIN
	? process.env.CORS_ORIGIN.split(',').map((origen) => origen.trim())
	: true

aplicacion.use(cors({ origin: origenesPermitidos, credentials: true }))
aplicacion.use(express.json())

// En producción sirve el build de React generado por Vite
aplicacion.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')))

aplicacion.use('/api/auth', rutasAuth)
aplicacion.use('/api/productos', rutasProductos)

aplicacion.use('/api', (req, res) => {
	res.status(404).json({ error: 'Ruta no encontrada' })
})

// Fallback SPA: el router de React se encarga de las demás rutas (por ejemplo /admin)
aplicacion.get(/^\/(?!api\/).*/, (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'))
})

aplicacion.use((error, req, res, next) => {
	console.error(error)

	if (res.headersSent) {
		return next(error)
	}

	res.status(500).json({ error: 'Error interno del servidor' })
})

let conexionMongo

async function conectarMongo() {
	if (!process.env.MONGODB_URI) {
		throw new Error('Falta configurar MONGODB_URI')
	}

	if (!conexionMongo) {
		conexionMongo = mongoose.connect(process.env.MONGODB_URI).catch((error) => {
			conexionMongo = null
			throw error
		})
	}

	return conexionMongo
}

async function iniciarServidor() {
	try {
		await conectarMongo()
		console.log('Conexión con MongoDB establecida')
	} catch (error) {
		console.error('Error al conectar con MongoDB:', error.message)
		process.exit(1)
	}

	aplicacion.listen(puerto, () => {
		console.log(`Servidor de Gekokoj en http://localhost:${puerto}`)
	})
}

if (require.main === module) {
	iniciarServidor()
}

module.exports = async function handler(req, res) {
	try {
		await conectarMongo()
		return aplicacion(req, res)
	} catch (error) {
		console.error('Error al conectar con MongoDB:', error.message)
		return res.status(500).json({ error: 'No se pudo conectar con la base de datos' })
	}
}
