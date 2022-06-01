window.addEventListener('DOMContentLoaded', () => {
  app()
})

class DomElement {
  constructor(parent, tagName, className, innerText = "", insertRule = "append") {
    this.parent = parent;
    this.tagName = tagName;
    this.className = className;
    this.innerText = innerText;
    this.insertRule = insertRule;

    this.node = document.createElement(tagName);
    this.node.className = className;
    this.node.innerText = innerText;

    function insertAfter(newNode, existingNode) {
      existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
    }

    if (this.insertRule === "append") {
      this.parent.append(this.node);
    }

    if (this.insertRule === "prepend") {
      this.parent.perpend(this.node);
    }

    if (typeof this.insertRule === "object") {
      insertAfter(this.node, insertRule);
    }
    
  }

  addAttribute(name, value) {
    this.node.setAttribute(name, value);
  }
}

class FriendsList extends DomElement {
  constructor(parent, tagName, className, innerText = "", insertRule, data = null) {
    super(parent, tagName, className, innerText, insertRule);
    this.data = data;
  }

  async getFriends(url, options) {
    try {
      const friendsList = await fetch(url, options);
      if (!friendsList.ok) {
        throw new Error(`some problem with fetching, status: ${friendsList.statusText}`)
      }
      this.data = await friendsList.json();
      this.addFriendCards();
    } catch(err) {
      console.error(err)
    }
  }

  addFriendCards() {
    Array.from(this.data).forEach(el => {
      new FriendCard(this.node, "li", "friends__item slider__item", "", "append", el)
    });
    const buttonsWrapper = new DomElement(this.parent, "div", "friends__slider-buttons", "", document.querySelector(".friends__list"));
    const buttonLeft = new DomElement(buttonsWrapper.node, "div", "friends__button-left control_prev");
    const buttonRight = new DomElement(buttonsWrapper.node, "div", "friends__button-right control_next")
  }
}

class FriendCard extends DomElement {
  constructor(parent, tagName, className, innerText, insertRule, friendData) {
    super(parent, tagName, className, innerText, insertRule);
    this.friendData = friendData;
    const link = new DomElement(this.node, "a", "friends__item-card-link");
    link.addAttribute("href", "#openModal");
    const img = new DomElement(link.node, "img", "friends__image");
    img.addAttribute("src", friendData.url);
    img.addAttribute("alt", `${friendData.breed}: ${friendData.name}`);
    const name = new DomElement(link.node, "p", "friends__name", friendData.name);
    const learnMoreBtn = new DomElement(link.node, "a", "button learn-more__button", "Learn more");
    learnMoreBtn.addAttribute("href", "#openModal");
  }
}

async function app(initial = true) {
  const friendCards = await new FriendsList(document.querySelector("#friends"), "ul", "friends__list slider", "", document.querySelector(".friends__title")).getFriends("../../assets/pets.json");

  if (initial) {
    document.querySelector(".burger").addEventListener('click', toggleMenu);
    navigation();
    mainSlider();
    modal();
    watchMediaChanges();
  } else {
    mainSlider();
    modal();
  }

  
}

function toggleMenu() {
      let burgerElement = document.querySelector(".burger");
      if (window.innerWidth > 768) {
        document.body.style.overflow = "visible";
        burgerElement.className = "burger closed";
        if (document.querySelector('.fade')) {
          document.querySelector(".fade").remove();
        }
        return
      }

      burgerElement.classList.toggle("open");
      burgerElement.classList.toggle("closed");
      if (Array.from(burgerElement.classList).includes("open")) {
        document.body.style.overflow = "hidden";
        let shadow = document.createElement("div");
        shadow.classList.add("fade");
        document.body.append(shadow);
        shadow.addEventListener('click', closeMenu);
      } else {
        document.body.style.overflow = "visible";
        document.querySelector('.fade').remove();
      }
}

function closeMenu() {
  let burgerElement = document.querySelector(".burger");
  document.body.style.overflow = "visible";
  burgerElement.className = "burger closed";
  if (document.querySelector('.fade')) {
    document.querySelector(".fade").remove();
  }
  return
}

function mainSlider() {
  let itemsPerPage = 0;
  let width = document.body.clientWidth;
  
  if (width >= 100 && width < 768) {
    itemsPerPage = 1;
  }
  if (width >= 768 && width < 1280) {
    itemsPerPage = 2;
  }
  if (width >= 1280) {
    itemsPerPage = 3;
  }

  let slider = document.querySelector('.slider');
  let slides = slider.querySelectorAll(".slider__item");

  let pageNumber = 1;
  let slidesQuantity = slides.length;
  let pagesQuantity = Math.ceil(slidesQuantity / itemsPerPage);
  
  let arrowLeft = document.querySelector(".control_prev");
  let arrowRight = document.querySelector(".control_next");

  arrowRight.addEventListener("click", nextSlide);
  arrowLeft.addEventListener("click", previousSlide);
  
  function reset() {
    for (let i = 0; i < slidesQuantity; i++) {
      slides[i].classList.remove("active__slide");
    }
  }
  
  function showSlides(direction) {
    reset();
    slides.forEach((slide, idx) => {
      let showFromIdx = ((pageNumber * itemsPerPage) - itemsPerPage);
      let showToIdx = (showFromIdx + itemsPerPage - 1) < slidesQuantity - 1 ? (showFromIdx + itemsPerPage - 1) : slidesQuantity - 1;
      if (idx >= showFromIdx && idx <= showToIdx) {
        slide.classList.add("active__slide");
      }
    })
  }

  function nextSlide() {
    if (pageNumber === pagesQuantity && Array.from(Array.from(slides)[slidesQuantity - 1].classList).includes("active__slide")) {
      pageNumber = 1;
      showSlides();
      return
    }

    if (pageNumber < pagesQuantity) {
      pageNumber += 1;
      showSlides("next");
    }
  }

  function previousSlide() {
    if (pageNumber === 1 && Array.from(Array.from(slides)[0].classList).includes("active__slide")) {
      pageNumber = pagesQuantity;
      showSlides("prev");
      return
    }

    if (pageNumber > 1) {
      pageNumber -= 1;
      showSlides();
    }
  }

  showSlides()
}

function navigation() {
  let menuItems = document.querySelectorAll(".navigation__link");
  addListeners();
  highlightMenuItemsOnScroll();

  function addListeners() {
    menuItems.forEach(item => {
      item.addEventListener("click", selectMenuItem);
    })
  }

  function reset() {
    menuItems.forEach(item => item.parentNode.classList.remove("selected"));
  }

  function selectMenuItem(e) {
    reset();
    this.parentNode.classList.add("selected");
    document.body.style.overflow = "visible";
    closeMenu();
  }

  function highlightMenuItemsOnScroll() {
    window.addEventListener('scroll', () => {
      let scrollDistance = window.scrollY;
      if (scrollDistance < 200) {
        reset();
        menuItems[0].parentNode.classList.add("selected");
      }
    });
  }
}

async function modal() {
  let parent = document.querySelector(".main-footer");
  let buttons = document.querySelectorAll(".friends__item");
  let animalsData = await fetch("../../assets/pets.json").then(el => el.json());
  
  buttons.forEach(el => {
    el.addEventListener("click", handleBtnClick);
  })

  function handleBtnClick(e) {
    let name = this.querySelector(".friends__name").innerText.toLowerCase();
    
    addHtml(animalsData, name, parent);
    document.body.style.overflow = "hidden";
  }

  function addHtml(dogData, dogName, elToAppend) {
    const {name, url, breed, description, age, inoculations, diseases, parasites} = dogData.filter(el => el.name.toLowerCase() === dogName)[0];

    let markdown = "";
    if (window.innerWidth >= 768) {
      markdown = `
      <div class="modal-bg" id="openModal">
      <div class="modal">
        <div class="modal__close__wrapper">
        <a href="#close" class="modal__close"></a></div>
        <div class="modal__image-wrapper">
          <img class="modal__img" src="${url}" alt="${name}">
        </div>
        <div class="modal__text-wrapper">
          <h2 class="modal__name">${name}</h2>
          <p class="modal__breed">${breed}</p>
          <p class="modal__description">${description}</p>
          <ul class="modal__list">
            <li class="modal__item">
              <b>Age</b>: ${age}
            </li>
            <li class="modal__item">
              <b>Inoculations</b>: ${inoculations}
            </li>
            <li class="modal__item">
              <b>Diseases</b>: ${diseases}
            </li>
            <li class="modal__item">
              <b>Parasites</b>: ${parasites}
            </li>
          </ul>
        </div>
      </div>
      </div>
      `
    } else {
      markdown = `
    <div class="modal-bg" id="openModal">
    <div class="modal">
      <div class="modal__close__wrapper">
      <a href="#close" class="modal__close"></a></div>
      <div class="modal__text-wrapper">
        <h2 class="modal__name">${name}</h2>
        <p class="modal__breed">${breed}</p>
        <p class="modal__description">${description}</p>
        <ul class="modal__list">
          <li class="modal__item">
            <b>Age</b>: ${age}
          </li>
          <li class="modal__item">
            <b>Inoculations</b>: ${inoculations}
          </li>
          <li class="modal__item">
            <b>Diseases</b>: ${diseases}
          </li>
          <li class="modal__item">
            <b>Parasites</b>: ${parasites}
          </li>
        </ul>
      </div>
    </div>
    </div>
    `
    }
    
    elToAppend.insertAdjacentHTML('afterend', markdown);

    let closeBtn = document.querySelector(".modal__close");
    
    document.querySelector(".modal").addEventListener("mouseover", (e) => {
        closeBtn.classList.remove("hover");
    });
    document.querySelector(".modal").addEventListener("mouseleave", (e) => {
        closeBtn.classList.add("hover");
    })

    closeBtn.addEventListener("click", () => {
      document.querySelector(".modal-bg").remove();
      document.body.style.overflow = "initial";
    })

    document.querySelector('.modal-bg').addEventListener('click', (e) => {
      if (e.target.className === "modal-bg") {
        document.querySelector(".modal-bg").remove();
        document.body.style.overflow = "initial";
      }
    })
  }
}

function watchMediaChanges() {
  const media768 = window.matchMedia('(max-width: 768px)');
  const media1280 = window.matchMedia('(max-width: 1280px)');
  media768.addEventListener("change", loadSliderOnMediaChange);
  media1280.addEventListener("change", loadSliderOnMediaChange);

  function loadSliderOnMediaChange(e) {
    if (e.matches) {
      closeMenu();
      document.querySelector(".friends__list").remove();
      document.querySelector(".friends__slider-buttons").remove();
      app(false);
    } else {
      closeMenu();
      document.querySelector(".friends__list").remove();
      document.querySelector(".friends__slider-buttons").remove();
      app(false);
    }
  }
}

