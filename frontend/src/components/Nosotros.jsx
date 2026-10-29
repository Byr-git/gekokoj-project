export default function Nosotros() {
	return (
		<section id="nosotros" className="nosotros section-container">
			<div className="nosotros__contenedor-img">
				<img
					className="nosotros__img"
					src="/assets/images/granja.jpg"
					alt="Aves de corral en un entorno de crianza"
					loading="lazy"
				/>

				<div className="nosotros__etiqueta">
					<span className="nosotros__nombre">Gekokoj</span>
					<p className="nosotros__slogan">Cuidando nace la calidad</p>
				</div>
			</div>

			<div className="nosotros__contenido">
				<div className="seccion-cabecera">
					<span className="seccion-tag">SOBRE NOSOTROS</span>
					<h2 className="seccion-titulo">Detrás de cada ave, hay un compromiso</h2>
				</div>

				<div className="nosotros__descripcion">
					<p>
						En Gekokoj nos dedicamos a la crianza y comercialización de aves de corral y productos avícolas. Queremos acercar a nuestros clientes opciones para la crianza y la producción, con una atención responsable y cercana.
					</p>
					<p>
						Trabajamos para ofrecer productos acordes con las necesidades de cada cliente, brindando información clara sobre su disponibilidad y características.
					</p>
				</div>

				<div className="nosotros__lista">
					<article className="nosotros__item">
						<img className="item__icono icon-light" src="/assets/icons/feather.svg" alt="" />
						<div className="item__contenido">
							<h3 className="item__titulo">Crianza responsable</h3>
							<p className="item__descripcion">Atención a las necesidades de las aves y su crianza.</p>
						</div>
					</article>

					<article className="nosotros__item">
						<img className="item__icono icon-light" src="/assets/icons/heart.svg" alt="" />
						<div className="item__contenido">
							<h3 className="item__titulo">Atención cercana</h3>
							<p className="item__descripcion">Escuchamos a nuestros clientes y sus necesidades.</p>
						</div>
					</article>

					<article className="nosotros__item">
						<img className="item__icono icon-light" src="/assets/icons/egg.svg" alt="" />
						<div className="item__contenido">
							<h3 className="item__titulo">Variedad avícola</h3>
							<p className="item__descripcion">Aves y productos para diferentes propósitos de crianza.</p>
						</div>
					</article>
				</div>

				<a className="button button--primary" href="#productos">
					Explorar productos
				</a>
			</div>
		</section>
	)
}
