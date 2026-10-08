const nav = document.querySelector("#nav");
const open_nav = document.querySelector("#open-nav");
const close_nav = document.querySelector("#close-nav");

open_nav.addEventListener("click", () => {
    nav.classList.add("visible");
})

close_nav.addEventListener("click", () => {
    nav.classList.remove("visible")
})