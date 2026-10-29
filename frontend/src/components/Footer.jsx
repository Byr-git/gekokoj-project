export default function Footer() {
	return (
		<footer className="footer">
			<div className="footer__principal section-container">
				<div className="footer__introduccion">
					<a href="#inicio" className="marca">
						<img className="marca__logo" src="/assets/logo.svg" alt="Gekokoj" />
						<div className="marca__info">
							<span className="marca__nombre">Gekokoj</span>
							<span className="marca__slogan">Cuidando nace la calidad</span>
						</div>
					</a>

					<p className="footer__descripcion">
						Crianza responsable y productos avícolas para acompañarte en cada etapa.
					</p>
				</div>

				<nav className="footer__nav" aria-label="Navegación del pie de página">
					<h2 className="footer__titulo">Explora</h2>

					<ul className="footer__links">
						<li><a className="footer__link" href="#inicio">Inicio</a></li>
						<li><a className="footer__link" href="#productos">Nuestros productos</a></li>
						<li><a className="footer__link" href="#nosotros">Sobre nosotros</a></li>
						<li><a className="footer__link" href="#contacto">Contacto</a></li>
					</ul>
				</nav>

				<div className="footer__contacto">
					<h2 className="footer__titulo">¿Hablamos?</h2>

					<p className="footer__descripcion">
						¿Buscas aves o productos avícolas? Escríbenos y cuéntanos qué necesitas.
					</p>

					<a className="button button--primary" href="#contacto">
						Contáctanos
						<img className="icon-dark" src="/assets/icons/move-up-right.svg" alt="" />
					</a>
				</div>
			</div>

			<div className="footer-fondo">
				<div className="footer-fondo__contenido section-container">
					<p className="footer__copyright">
						© {new Date().getFullYear()} Gekokoj. Todos los derechos reservados.
					</p>

					<a className="footer__regresar-arriba" href="#inicio">
						Volver arriba ↑
					</a>
				</div>
			</div>
		</footer>
	)
}
