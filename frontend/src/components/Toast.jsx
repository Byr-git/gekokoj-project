import { useCarrito } from '../CarritoContext.jsx'

export default function Toast() {
	const { toast } = useCarrito()

	return (
		<div
			className={toast ? 'toast toast--visible' : 'toast'}
			data-tipo={toast?.tipo}
			role="status"
			aria-live="polite"
			aria-atomic="true"
		>
			{toast?.mensaje || ''}
		</div>
	)
}
