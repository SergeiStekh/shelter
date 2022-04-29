window.addEventListener('DOMContentLoaded', () => {
  let burgerElement = document.querySelector(".burger");
  burgerElement.addEventListener('click', toggleMenu);
  navigation();
})

function toggleMenu(e) {
  if (e) {e.preventDefault()};
  document.querySelector(".burger").classList.toggle("open");
  document.querySelector(".burger").classList.toggle("closed");
}

function navigation() {
  let menuItems = document.querySelectorAll(".navigation__item");
  addListeners();
  highlightMenuItemsOnScroll();

  function addListeners() {
    menuItems.forEach(item => {
      item.addEventListener("click", selectMenuItem);
    })
  }

  function reset() {
    menuItems.forEach(item => item.classList.remove("selected"));
  }

  function selectMenuItem(e) {
    reset();
    this.classList.add("selected");
  }

  function highlightMenuItemsOnScroll() {
    window.addEventListener('scroll', () => {
      let scrollDistance = window.scrollY;
      if (scrollDistance < 200) {
        reset();
        menuItems[1].classList.add("selected");
      }
    });
  }
}
