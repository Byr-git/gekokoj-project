// Menú hamburguesa
const nav = document.querySelector("#nav");
const open_nav = document.querySelector("#nav-open");
const close_nav = document.querySelector("#nav-close");

open_nav.addEventListener("click", () => {
    nav.classList.add("visible");
})

close_nav.addEventListener("click", () => {
    nav.classList.remove("visible")
})

// Evitar reinicio de página al hacer submit
const formulario = document.querySelector('#contacto-form')
formulario.addEventListener('submit', (event) => {
    event.preventDefault()

    console.log('Formulario enviado sin recargar la página')
})