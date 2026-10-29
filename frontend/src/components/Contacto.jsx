import { useState } from 'react'

export default function Contacto() {
	const [aviso, setAviso] = useState('')

	const enviar = (evento) => {
		evento.preventDefault()
		setAviso('Tu mensaje está listo. Muy pronto podrás enviarlo desde aquí.')
	}

	return (
		<section id="contacto" className="contacto section-container section-container__inside">
			<div className="seccion-cabecera">
				<span className="seccion-tag">PONTE EN CONTACTO</span>
				<h2 className="seccion-titulo">Estamos aquí para escucharte</h2>
				<p className="seccion-descripcion">
					¿Tienes alguna consulta o quieres saber más sobre nuestros productos?
					Escríbenos y estaremos encantados de atenderte.
				</p>
			</div>

			<div className="contacto__contenido">
				<div className="contacto__presentacion">
					<div className="contacto__marca">
						<img className="contacto__logo" src="/assets/logo.svg" alt="" />
						<span className="contacto__nombre-marca">Gekokoj</span>
					</div>

					<h3 className="contacto__titulo">Cada consulta cuenta.</h3>

					<p className="contacto__descripcion">
						Queremos ofrecerte una atención cercana y ayudarte a encontrar las opciones que mejor se adapten a tus necesidades.
					</p>

					<div className="contacto__frase">
						<img className="contacto__icono-frase icon-dark" src="/assets/icons/heart.svg" alt="" />
						<p className="contacto__texto-frase">
							Cuidando nace la calidad, y una buena atención también forma parte de ella.
						</p>
					</div>

					<img className="contacto__img" src="/assets/images/gallinas-echadas.webp" alt="" loading="lazy" />
				</div>

				<form className="contacto__formulario" onSubmit={enviar}>
					<div className="formulario__cabecera">
						<span className="seccion-tag">TU MENSAJE</span>
						<h3 className="formulario__titulo">Cuéntanos qué necesitas</h3>
						<p className="formulario__descripcion">Completa los campos y déjanos tu consulta.</p>
					</div>

					<div className="formulario__grupo">
						<label className="formulario__etiqueta" htmlFor="nombre">Nombre completo</label>
						<input
							className="formulario__input"
							id="nombre"
							name="nombre"
							type="text"
							autoComplete="name"
							required
							placeholder="¿Cómo te llamas?"
						/>
					</div>

					<div className="formulario__grupo">
						<label className="formulario__etiqueta" htmlFor="correo">Correo electrónico</label>
						<input
							className="formulario__input"
							id="correo"
							name="correo"
							type="email"
							autoComplete="email"
							required
							placeholder="ejemplo@correo.com"
						/>
					</div>

					<div className="formulario__grupo">
						<label className="formulario__etiqueta" htmlFor="asunto">Asunto</label>
						<input
							className="formulario__input"
							id="asunto"
							name="asunto"
							type="text"
							required
							placeholder="¿Sobre qué deseas consultarnos?"
						/>
					</div>

					<div className="formulario__grupo">
						<label className="formulario__etiqueta" htmlFor="mensaje">Mensaje</label>
						<textarea
							className="formulario__textarea"
							id="mensaje"
							name="mensaje"
							required
							rows="5"
							placeholder="Escribe tu mensaje aquí..."
						/>
					</div>

					<button className="button button--primary contacto__submit" type="submit">
						Enviar mensaje
						<img className="contacto__submit-icon icon-dark" src="/assets/icons/send-horizontal.svg" alt="" />
					</button>

					<p className="formulario__aviso" role="status" aria-live="polite">{aviso}</p>
				</form>
			</div>
		</section>
	)
}
