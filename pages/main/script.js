window.addEventListener('DOMContentLoaded', () => {
  let burgerElement = document.querySelector(".burger");
  burgerElement.addEventListener('click', toggleMenu);
})

function toggleMenu(e) {
  e.preventDefault();
  document.querySelector(".burger").classList.toggle("open");
  document.querySelector(".burger").classList.toggle("closed");
}