
window.addEventListener('DOMContentLoaded', () => {
  app();
})

async function app(initial = true) {
  const friendCards = await new FriendsList(document.querySelector("#friends"), "ul", "friends__list slider", "", document.querySelector(".friends__title")).getFriends("../../assets/pets.json");

  if (initial) {
    document.querySelector(".burger").addEventListener('click', toggleMenu);
    navigation();
    pagination();
    modal();
    watchMediaChanges();
  } else {
    pagination();
    modal();
  }
}

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

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array
  }

  addFriendCards() {
    let dataWithoutPromienik = [...this.data].slice(0, this.data.length - 1);
    
    [...this.shuffleArray(dataWithoutPromienik), ...this.shuffleArray(dataWithoutPromienik), ...this.shuffleArray(dataWithoutPromienik), ...this.shuffleArray(dataWithoutPromienik), ...this.shuffleArray(dataWithoutPromienik), ...this.shuffleArray(dataWithoutPromienik)].forEach(el => {
      new FriendCard(this.node, "li", "friends__item slider__item", "", "append", el)
    });

    const paginationWrapper = new DomElement(this.parent, "div", "friends__pagination pagination", "", document.querySelector(".friends__list"));

    const paginationItem1 = new DomElement(paginationWrapper.node, "a", "pagination__item pagination__disabled pagination__twin-arrow-left", "<<");
    paginationItem1.addAttribute("href", "#");

    const paginationItem2 = new DomElement(paginationWrapper.node, "a", "pagination__item pagination__disabled pagination__arrow__left", "<");
    paginationItem2.addAttribute("href", "#");

    const paginationItem3 = new DomElement(paginationWrapper.node, "a", "pagination__item pagination__active  pagination__page", "1");
    paginationItem3.addAttribute("href", "#");

    const paginationItem4 = new DomElement(paginationWrapper.node, "a", "pagination__item pagination__arrow__right", ">");
    paginationItem4.addAttribute("href", "#");

    const paginationItem5 = new DomElement(paginationWrapper.node, "a", "pagination__item pagination__twin-arrow-right", ">>");
    paginationItem4.addAttribute("href", "#");
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
        menuItems[1].parentNode.classList.add("selected");
      }
    });
  }
}

function pagination(windowWidth = window.innerWidth) {
  let itemsPerPage = 0;
  if (windowWidth >= 100 && windowWidth < 768) {
    itemsPerPage = 3;
  }
  if (windowWidth >= 768 && windowWidth < 1280) {
    itemsPerPage = 6;
  }
  if (windowWidth >= 1280) {
    itemsPerPage = 8;
  }
  let slides = Array.from(document.querySelectorAll(".friends__item"));
  
  let slidesQuantity = document.querySelectorAll(".friends__item").length;
  let pagesQuantity = Math.ceil(slidesQuantity / itemsPerPage);
  let pageNumber = 1;

  let buttonsParent = document.querySelector(".pagination");

  buttonsParent.addEventListener("click", paginate);

  function paginate(e) {
    e.preventDefault();
    e.stopPropagation();

    let previousPageBtnPressed = Array.from(e.target.classList).includes("pagination__arrow__left");

    let nextPageBtnPressed = Array.from(e.target.classList).includes("pagination__arrow__right");
    
    let toFirstPageBtnPressed = Array.from(e.target.classList).includes("pagination__twin-arrow-left");

    let toLastPageBtnPressed = Array.from(e.target.classList).includes("pagination__twin-arrow-right");

    if (previousPageBtnPressed) {
      previousPage();
    }

    if (nextPageBtnPressed) {
      nextPage();
    }

    if (toFirstPageBtnPressed) {
      firstPage();
    }

    if(toLastPageBtnPressed) {
      lastPage();
    }
  }

  function showSlides() {
    reset();
    adjustButtonStyles();

    let pageElement = document.querySelector(".pagination__page");
    pageElement.innerHTML = pageNumber;

    let memorizer = [];

    slides.forEach((slide, idx, allSlidesArr) => {
      let petName = slide.querySelector(".friends__name").innerText;
      let showFromIdx = ((pageNumber * itemsPerPage) - itemsPerPage);
      let showToIdx = (showFromIdx + itemsPerPage - 1) < slidesQuantity - 1 ? (showFromIdx + itemsPerPage - 1) : slidesQuantity - 1;
      if (idx >= showFromIdx && idx <= showToIdx) {
        if (!memorizer.includes(petName)) {
          slide.classList.add("visible");
          memorizer.push(petName);
        } else {
          let notShowedPet = allSlidesArr.filter(el => !memorizer.includes(el.querySelector(".friends__name").innerText))[0];
          notShowedPet.classList.add("visible");
          notShowedPetName = notShowedPet.querySelector(".friends__name").innerText;
          memorizer.push(notShowedPetName);
        }
      }
    })
  }

  function reset() {
    slides.forEach(slide => slide.classList.remove("visible"));
    document.querySelector(".pagination__twin-arrow-left").classList.remove("pagination__disabled");
    document.querySelector(".pagination__twin-arrow-right").classList.remove("pagination__disabled");
    document.querySelector(".pagination__arrow__left").classList.remove("pagination__disabled");
    document.querySelector(".pagination__arrow__right").classList.remove("pagination__disabled");
  }

  function nextPage() {
    if (pageNumber < pagesQuantity) {
      pageNumber += 1;
      showSlides();
    }
  }

  function previousPage() {
    if (pageNumber > 1) {
      pageNumber -= 1;
      showSlides();
    }
  }

  function firstPage() {
    if (pageNumber > 1) {
    pageNumber = 1;
    showSlides();
  }
  }
  
  function lastPage() {
    if (pageNumber < pagesQuantity) {
    pageNumber = pagesQuantity;
    showSlides();
  }
  }

  function adjustButtonStyles() {
    if (pageNumber === 1) {
      document.querySelector(".pagination__twin-arrow-left").classList.add("pagination__disabled");
      document.querySelector(".pagination__arrow__left").classList.add("pagination__disabled");
    }

    if (pageNumber === pagesQuantity) {
      document.querySelector(".pagination__twin-arrow-right").classList.add("pagination__disabled");
      document.querySelector(".pagination__arrow__right").classList.add("pagination__disabled");
    }
  }

  showSlides();
}

function modal() {
  let animalsData = {
    jennifer: {
      url: "../../assets/images/pets-jennifer.jpg",
      name: "Jennifer",
      breed: "Dog - Labrador",
      description: "Jennifer is a sweet 2 months old Labrador that is patiently waiting to find a new forever home. This girl really enjoys being able to go outside to run and play, but won't hesitate to play up a storm in the house if she has all of her favorite toys.",
      age: "2 months",
      inoculations: "none",
      diseases: "none",
      parasites: "none"
    },
    katrine: {
      url: "../../assets/images/pets-katrine-third.jpg",
      name: "Katrine",
      breed: "Cat - British Shorthair",
      description: "Katrine is a beautiful girl. She is as soft as the finest velvet with a thick lush fur. Will love you until the last breath she takes as long as you are the one. She is picky about her affection. She loves cuddles and to stretch into your hands for a deeper relaxations.",
      age: "2 months",
      inoculations: "none",
      diseases: "none",
      parasites: "none"
    },
    sophia: {
      url: "../../assets/images/pets-katrine-first.jpg",
      name: "Sophia",
      breed: "Dog - Shih tzu",
      description: "Sophia here and I'm looking for my forever home to live out the best years of my life. I am full of energy. Everyday I'm learning new things, like how to walk on a leash, go potty outside, bark and play with toys and I still need some practice.",
      age: "2 months",
      inoculations: "none",
      diseases: "none",
      parasites: "none"
    },
    woody: {
      url: "../../assets/images/pets-woody.jpg",
      name: "Woody",
      breed: "Dog - Golden Retriever",
      description: "Woody is a handsome 3 1/2 year old boy. Woody does know basic commands and is a smart pup. Since he is on the stronger side, he will learn a lot from your training. Woody will be happier when he finds a new family that can spend a lot of time with him.",
      age: "3 1/2 year",
      inoculations: "none",
      diseases: "none",
      parasites: "none"
    },
    scarlett: {
      url: "../../assets/images/pets-scarlet.jpg",
      name: "Scarlett",
      breed: "Dog - Jack Russell Terrier",
      description: "Scarlett is a happy, playful girl who will make you laugh and smile. She forms a bond quickly and will make a loyal companion and a wonderful family dog or a good companion for a single individual too since she likes to hang out and be with her human.",
      age: "2 month",
      inoculations: "none",
      diseases: "none",
      parasites: "none"
    },
    timmy: {
      url: "../../assets/images/pets-timmy.jpg",
      name: "Timmy",
      breed: "Cat - British Shorthair",
      description: "Timmy is an adorable grey british shorthair male. He loves to play and snuggle. He is neutered and up to date on age appropriate vaccinations. He can be chatty and enjoys being held. Timmy has a lot to say and wants a person to share his thoughts with.",
      age: "2 month",
      inoculations: "none",
      diseases: "none",
      parasites: "none"
    },
    freddie: {
      url: "../../assets/images/pets-katrine-second.jpg",
      name: "Freddie",
      breed: "Cat - British Shorthair",
      description: "Freddie is a little shy at first, but very sweet when he warms up. He likes playing with shoe strings and bottle caps. He is quick to learn the rhythms of his human’s daily life. Freddie has bounced around a lot in his life, and is looking to find his forever home.",
      age: "2 month",
      inoculations: "none",
      diseases: "none",
      parasites: "none"
    },
    charly: {
      url: "../../assets/images/pets-charly.jpg",
      name: "Charly",
      breed: "Dog - Jack Russell Terrier",
      description: "This cute boy, Charly, is three years old and he likes adults and kids. He isn’t fond of many other dogs, so he might do best in a single dog home. Charly has lots of energy, and loves to run and play. We think a fenced yard would make him very happy.",
      age: "3 years",
      inoculations: "none",
      diseases: "none",
      parasites: "none"
    },
    promienik: {
      url: "../../assets/images/promienik.png",
      name: "Promienik",
      breed: "Parrot - Lovebird",
      description: "This cute boy, Promienik, is eight years old and he likes everyone and smile all the time. He is the very best friend for everyone. Promienik has lots of energy, and loves to fly and play. He will enjoy every game with you.",
      age: "8 years",
      inoculations: "none",
      diseases: "none",
      parasites: "none"
    }
  }

  let parent = document.querySelector(".pets-footer");
  let buttons = document.querySelectorAll(".friends__item");

  buttons.forEach(el => {
    el.addEventListener("click", handleBtnClick);
  })

  function handleBtnClick(e) {
    let name = this.querySelector(".friends__name").innerText.toLowerCase();
    
    addHtml(animalsData, name, parent);
    document.body.style.overflow = "hidden";
  }

  function addHtml(dogData, dogName, elToAppend) {
    const {name, url, breed, description, age, inoculations, diseases, parasites} = dogData[dogName.toLowerCase()];

    let markdown = `
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
    })}

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
      document.querySelector(".friends__pagination").remove();
      app(false);
    } else {
      closeMenu();
      document.querySelector(".friends__list").remove();
      document.querySelector(".friends__pagination").remove();
      app(false);
    }
  }
}
