import { useCallback, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CarritoProvider } from './CarritoContext.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Productos from './components/Productos.jsx'
import Nosotros from './components/Nosotros.jsx'
import Contacto from './components/Contacto.jsx'
import Footer from './components/Footer.jsx'
import Carrito from './components/Carrito.jsx'
import Toast from './components/Toast.jsx'
import AdminLogin from './components/admin/AdminLogin.jsx'
import RutaProtegida from './components/admin/RutaProtegida.jsx'
import PanelAdmin from './components/admin/PanelAdmin.jsx'

function Pagina() {
	const [carritoAbierto, setCarritoAbierto] = useState(false)

	const abrirCarrito = useCallback(() => setCarritoAbierto(true), [])
	const cerrarCarrito = useCallback(() => setCarritoAbierto(false), [])

	return (
		<CarritoProvider>
			<>
				<Header onAbrirCarrito={abrirCarrito} />

				<main>
					<Hero />
					<Productos />
					<Nosotros />
					<Contacto />
				</main>

				<Footer />
				<Toast />
				<Carrito abierto={carritoAbierto} onCerrar={cerrarCarrito} />
			</>
		</CarritoProvider>
	)
}

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<Pagina />} />
			<Route path="/admin/login" element={<AdminLogin />} />
			<Route path="/admin" element={<RutaProtegida><PanelAdmin /></RutaProtegida>} />
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	)
}
