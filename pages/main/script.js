window.addEventListener('DOMContentLoaded', () => {
  let windowWidth = window.innerWidth;
  window.addEventListener('resize', (e) => {
    windowWidth = window.innerWidth;
    mainSlider(windowWidth);
  });

  let burgerElement = document.querySelector(".burger");

  burgerElement.addEventListener('click', toggleMenu);

  mainSlider(windowWidth);
})

function toggleMenu(e) {
  e.preventDefault();
  document.querySelector(".burger").classList.toggle("open");
  document.querySelector(".burger").classList.toggle("closed");
}

function mainSlider(windowWidth = window.innerWidth) {
  let slider = document.getElementById('slider');
  let sliderItems = slider.querySelectorAll(".slider__item");
  let arrowLeft = document.querySelector(".control_prev");
  let arrowRight = document.querySelector(".control_next");
  let current = 0;
  let current2 = 1;
  let current3 = 2;
  
  function reset() {
    for (let i = 0; i < sliderItems.length; i++) {
      sliderItems[i].classList.remove("active__slide");
    }
  }
  
  function init() {
    reset();
    if (windowWidth < 768) {
      sliderItems[0].classList.add("active__slide");
    }

    if (windowWidth >= 768 && windowWidth < 1280) {
      sliderItems[0].classList.add("active__slide");
      sliderItems[1].classList.add("active__slide");
    } 

    if (windowWidth >= 1280) {
      sliderItems[0].classList.add("active__slide");
      sliderItems[1].classList.add("active__slide");
      sliderItems[2].classList.add("active__slide");
    }
  }
  
  function slideLeft() {
    reset();
    if (windowWidth < 768) {
      sliderItems[current - 1].classList.add("active__slide");
      current--;
    }

    if (windowWidth >= 768 && windowWidth < 1280) {
      sliderItems[current - 2].classList.add("active__slide");
      sliderItems[current2 - 2].classList.add("active__slide");
      current--;
      current--;
      current2--;
      current2--;
    } 

    if (windowWidth >= 1280) {
      if (sliderItems[current - 3] === undefined || sliderItems[current2 - 3] === undefined || sliderItems[current3 - 3] === undefined) {
        current = 0;
        current2 = 1;
        current3 = 2;
        sliderItems[current].classList.add("active__slide");
        sliderItems[current2].classList.add("active__slide");
      } else {
        sliderItems[current - 3].classList.add("active__slide");
        sliderItems[current2 - 3].classList.add("active__slide");
        sliderItems[current3 - 3].classList.add("active__slide");
        current -= 3;
        current2 -= 3;
        current3 -= 3;
      }
    }
  }
  
  arrowLeft.addEventListener("click", function () {
    if (windowWidth < 768) {
      if (current === 0) {
        current = sliderItems.length;
      }
    }

    if (windowWidth >= 768 && windowWidth < 1280) {
      if (current === 0 && current2 === 1) {
        current = sliderItems.length;
        current2 = sliderItems.length + 1;
      }
    } 

    if (windowWidth >= 1280) {
      if (current === 0 && current2 === 1 && current3 === 2) {
        current = sliderItems.length;
        current2 = sliderItems.length + 1;
        current3 = sliderItems.length + 2;
      }
    }
    slideLeft();
  });
  
  function slideRight() {
    reset();
    if (windowWidth < 768) {
      sliderItems[current + 1].classList.add("active__slide");
      current++;
    }

    if (windowWidth >= 768 && windowWidth < 1280) {
      sliderItems[current + 2].classList.add("active__slide");
      sliderItems[current2 + 2].classList.add("active__slide");
      current++;
      current++;
      current2++;
      current2++;
    } 

    if (windowWidth >= 1280) {
      
      sliderItems[current + 3] ? sliderItems[current + 3].classList.add("active__slide") : null;

      sliderItems[current2 + 3] ? sliderItems[current2 + 3].classList.add("active__slide") : null;

      sliderItems[current3 + 3] ? sliderItems[current3 + 3].classList.add("active__slide") : null;

      current += 3;
      current2 += 3;
      current3 += 3;
    }
  }
  
  arrowRight.addEventListener("click", function () {
    if (windowWidth < 768) {
      if (current === sliderItems.length - 1) {
        current = -1;
      }
    }

    if (windowWidth >= 768 && windowWidth < 1280) {
      if (current === sliderItems.length - 2 && current2 === sliderItems.length - 1) {
        current = -2;
        current2 = -1;
      }
    } 

    if (windowWidth >= 1280) {
      if (current === sliderItems.length - 3 && current2 === sliderItems.length - 2 && current3 === sliderItems.length - 1) {
        current = -3;
        current2 = -2;
        current3 = -1;
      }

      if (current === sliderItems.length - 2 && current2 === sliderItems.length - 1) {
        current = -3;
        current2 = -2;
        current3 = -1;
      }
    }
    slideRight();
  });
  init()
}

