export default function Hero() {
	return (
		<section id="inicio" className="hero">
			<div className="hero__contenido">
				<h1 className="hero__titulo">
					Criamos aves de corral con todo el <span className="hero__resaltado">respeto </span>que se merecen
				</h1>
				<p className="hero__descripcion">
					Nos dedicamos a la crianza y comercialización de aves y productos avícolas, procurando ofrecer animales saludables y productos seleccionados con responsabilidad.
				</p>
				<div className="hero__acciones">
					<a className="button button--primary" href="#productos">Ver productos</a>
					<a className="button button--secondary" href="#nosotros">Conoce Gekokoj</a>
				</div>
			</div>
		</section>
	)
}
