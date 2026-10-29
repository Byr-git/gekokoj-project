import { useCallback, useState } from 'react'
import { CarritoProvider } from './CarritoContext.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Productos from './components/Productos.jsx'
import Nosotros from './components/Nosotros.jsx'
import Contacto from './components/Contacto.jsx'
import Footer from './components/Footer.jsx'
import Carrito from './components/Carrito.jsx'
import Toast from './components/Toast.jsx'

function Pagina() {
	const [carritoAbierto, setCarritoAbierto] = useState(false)

	const abrirCarrito = useCallback(() => setCarritoAbierto(true), [])
	const cerrarCarrito = useCallback(() => setCarritoAbierto(false), [])

	return (
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
	)
}

export default function App() {
	return (
		<CarritoProvider>
			<Pagina />
		</CarritoProvider>
	)
}
