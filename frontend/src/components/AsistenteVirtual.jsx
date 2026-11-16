import { useEffect } from 'react'

// Identificador del widget de Elfsight (AI Chatbot)
const WIDGET_ID = '30597db4-4834-4d5b-8b63-3c3f591c1b5c'
const SCRIPT_ID = 'elfsight-platform'

export default function AsistenteVirtual() {
	useEffect(() => {
		// Carga la plataforma de Elfsight una sola vez (evita duplicados con StrictMode)
		if (!document.getElementById(SCRIPT_ID)) {
			const script = document.createElement('script')
			script.id = SCRIPT_ID
			script.src = 'https://elfsightcdn.com/platform.js'
			script.async = true
			document.body.appendChild(script)
		}
	}, [])

	return <div className={`elfsight-app-${WIDGET_ID}`} data-elfsight-app-lazy />
}
