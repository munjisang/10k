// -------------------- 레시피 JSON 로드 --------------------
fetch('./data/recipe.json')
  .then(res => res.json())
  .then(data => {
    const list = data.recipes;

    // 리스트, 그리드, 가로 영역 처리
    document.querySelectorAll('.list-items, .grid-items, .horizontal-items').forEach(area => {
      const count = parseInt(area.dataset.count, 10) || 0;
      const randomRecipes = list.sort(() => Math.random() - 0.5).slice(0, count);

      randomRecipes.forEach(recipe => {
        let item = document.createElement('div');

        if (area.classList.contains('list-items')) {
          item.className = 'list-item';
          item.innerHTML = `
            <div class="list-item-thumb">
              <img src="${recipe.cok_thumb}" alt="${recipe.food_name || recipe.cok_title}" class="thumb-img">
              <img src="/img/move.png" alt="" class="video-icon" style="display:${recipe.cok_video_src ? '' : 'none'};">
            </div>
            <div class="recipe-info">
              <div class="recipe-name">${recipe.cok_title}</div>
              <div class="recipe-chef">by. ${recipe.cok_reg_nm}</div>
              <div class="recipe-cook">
                <div class="cook-degree-wrap">
                  <img src="/img/degree.png" alt="난이도 아이콘">
                  <span class="cook-degree">${recipe.cok_degree}</span>
                </div>
                <div class="cook-time-wrap">
                  <img src="/img/time.png" alt="시간 아이콘">
                  <span class="cook-time">${recipe.cok_time}</span>
                </div>
              </div>
            </div>
          `;
        } else if (area.classList.contains('grid-items')) {
          item.className = 'grid-item';
          item.innerHTML = `
            <div class="grid-item-thumb">
              <img src="${recipe.cok_thumb}" alt="${recipe.food_name || recipe.cok_title}" class="thumb-img">
              <img src="/img/move.png" alt="" class="video-icon" style="display:${recipe.cok_video_src ? '' : 'none'};">
            </div>
            <div class="recipe-info">
              <div class="recipe-name">${recipe.cok_title}</div>
              <div class="recipe-chef">by. ${recipe.cok_reg_nm}</div>
              <div class="recipe-cook">
                <div class="cook-degree-wrap">
                  <img src="/img/degree.png" alt="난이도 아이콘">
                  <span class="cook-degree">${recipe.cok_degree}</span>
                </div>
                <div class="cook-time-wrap">
                  <img src="/img/time.png" alt="시간 아이콘">
                  <span class="cook-time">${recipe.cok_time}</span>
                </div>
              </div>
            </div>
          `;
        } else if (area.classList.contains('horizontal-items')) {
          item.className = 'horizontal-item';
          item.innerHTML = `
            <div class="horizontal-item-thumb">
              <img src="${recipe.cok_thumb}" alt="${recipe.food_name || recipe.cok_title}" class="thumb-img">
              <img src="/img/move.png" alt="" class="video-icon" style="display:${recipe.cok_video_src ? '' : 'none'};">
            </div>
            <div class="recipe-info">
              <div class="recipe-name">${recipe.cok_title}</div>
              <div class="recipe-chef">by. ${recipe.cok_reg_nm}</div>
              <div class="recipe-cook">
                <div class="cook-degree-wrap">
                  <img src="/img/degree.png" alt="난이도 아이콘">
                  <span class="cook-degree">${recipe.cok_degree}</span>
                </div>
                <div class="cook-time-wrap">
                  <img src="/img/time.png" alt="시간 아이콘">
                  <span class="cook-time">${recipe.cok_time}</span>
                </div>
              </div>
            </div>
          `;
        }

        item.addEventListener('click', () => {
          window.open(`https://m.10000recipe.com/recipe/${recipe.cok_sq_board}`, '_blank');
        });

        area.appendChild(item);
      });
    });

    // -------------------- 숏텐츠 아코디언 --------------------
    const accordionArea = document.querySelector('.accordion-items');
    const accordionRecipes = list.sort(() => Math.random() - 0.5).slice(0, 5);

    accordionRecipes.forEach(recipe => {
      const accItem = document.createElement('div');
      accItem.className = 'accordion-item';
      accItem.innerHTML = `
        <div class="accordion-header">
          <img src="/img/search.png" alt="search" class="accordion-icon">
          <span class="accordion-title">${recipe.food_name}</span>
          <img src="${recipe.cok_thumb}" alt="thumbnail" class="accordion-thumb">
          <img src="/img/chevron_down.png" alt="toggle" class="accordion-chevron">
        </div>
        <div class="accordion-body">
          <div class="recipe-info">
            <div class="recipe-name">${recipe.cok_title}</div>
            <div class="recipe-chef">by. ${recipe.cok_reg_nm}</div>
          </div>
          <img src="${recipe.cok_thumb}" alt="thumbnail" class="accordion-body-thumb">
        </div>
      `;
      accordionArea.appendChild(accItem);
    });

    // 아코디언 초기화
    function initAccordion() {
      const items = document.querySelectorAll(".accordion-item");
      items.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const body = item.querySelector('.accordion-body');

        header.addEventListener('click', () => {
          item.classList.toggle('open');
        });

        body.addEventListener('click', e => {
          const recipeIndex = Array.from(items).indexOf(item);
          const recipe = accordionRecipes[recipeIndex];
          window.open(`https://m.10000recipe.com/recipe/${recipe.cok_sq_board}`, '_blank');
          e.stopPropagation();
        });
      });
    }

    initAccordion();

  })
  .catch(err => console.error('레시피 로드 실패:', err));





const galleryIcon = document.querySelector(".gallery-icon");
const toast = document.getElementById("toast");

galleryIcon.addEventListener("click", () => {
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
});

// 배너 자동롤링 + 스와이프 // 
const bannerWrapper = document.querySelector('.banner-wrapper');
const slides = document.querySelectorAll('.banner-slide');
const currentNav = document.querySelector('.banner-navigation .current');
const totalNav = document.querySelector('.banner-navigation .total');

let currentIndex = 0;
const totalSlides = slides.length;
totalNav.textContent = totalSlides;

// 자동 롤링 (3초)
setInterval(() => {
    currentIndex = (currentIndex + 1) % totalSlides;
    bannerWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    currentNav.textContent = currentIndex + 1;
}, 3000);

// 좌우 스와이프 (터치 이벤트)
let startX = 0;
let isDragging = false;

bannerWrapper.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    isDragging = true;
});

bannerWrapper.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const moveX = e.touches[0].clientX - startX;
    bannerWrapper.style.transform = `translateX(${ -currentIndex * 100 + moveX / bannerWrapper.offsetWidth * 100 }%)`;
});

bannerWrapper.addEventListener('touchend', e => {
    isDragging = false;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    if (diff > 50) { // 오른쪽 스와이프
        currentIndex = currentIndex > 0 ? currentIndex - 1 : 0;
    } else if (diff < -50) { // 왼쪽 스와이프
        currentIndex = currentIndex < totalSlides -1 ? currentIndex + 1 : totalSlides -1;
    }
    bannerWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    currentNav.textContent = currentIndex + 1;
});


// 중간 배너 랜덤 이미지
const middleBanner = document.getElementById('middleBanner');
const banners = ['/img/middle_banner_1.png', '/img/middle_banner_2.png'];

// 랜덤으로 하나 선택
const randomIndex = Math.floor(Math.random() * banners.length);
middleBanner.src = banners[randomIndex];


// JS: 커스텀 드롭다운 동작
const customSelects = document.querySelectorAll(".custom-select");

customSelects.forEach(select => {
  const selected = select.querySelector(".selected");
  const optionsContainer = select.querySelector(".options");
  const optionsList = optionsContainer.querySelectorAll("li");
  const chevronIcon = select.querySelector(".chevron-icon");

  selected.addEventListener("click", () => {
    const isOpen = select.classList.toggle("open"); // open 클래스 토글
    optionsContainer.style.display = isOpen ? "block" : "none";
  });

  optionsList.forEach(option => {
    option.addEventListener("click", () => {
      selected.textContent = option.dataset.value;
      select.classList.remove("open"); // 선택 시 close
      optionsContainer.style.display = "none";
    });
  });

  // 외부 클릭 시 닫기
  document.addEventListener("click", (e) => {
    if (!select.contains(e.target)) {
      select.classList.remove("open");
      optionsContainer.style.display = "none";
    }
  });
});

// 숏텐츠 아코디언 //
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".accordion-item");
  let current = 0;
  let autoTimer;
  let resumeTimer;
  const INTERVAL = 3000;
  const RESUME = 3000;

  function closeAll() {
    items.forEach(item => item.classList.remove("open"));
  }

  function openItem(index) {
    closeAll();
    items[index].classList.add("open");
    current = index;
  }

  function startAuto() {
    autoTimer = setInterval(() => {
      const next = (current + 1) % items.length;
      openItem(next);
    }, INTERVAL);
  }

  function stopAuto() {
    clearInterval(autoTimer);
    clearTimeout(resumeTimer);
  }

  items.forEach((item, idx) => {
    const header = item.querySelector(".accordion-header");
    header.addEventListener("click", () => {
      if (item.classList.contains("open")) {
        item.classList.remove("open");
      } else {
        openItem(idx);
      }

      stopAuto();
      resumeTimer = setTimeout(startAuto, RESUME);
    });
  });

  openItem(0);
  startAuto();
});

// 인기검색어 아코디언 //
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".search-accordion-item");
  let current = 0;
  let autoTimer;
  let resumeTimer;
  const INTERVAL = 5000;
  const RESUME = 5000;

  function closeAll() {
    items.forEach(item => item.classList.remove("open"));
  }

  function openItem(index) {
    closeAll();
    items[index].classList.add("open");
    current = index;
  }

  function startAuto() {
    autoTimer = setInterval(() => {
      const next = (current + 1) % items.length;
      openItem(next);
    }, INTERVAL);
  }

  function stopAuto() {
    clearInterval(autoTimer);
    clearTimeout(resumeTimer);
  }

  items.forEach((item, idx) => {
    const header = item.querySelector(".search-accordion-header");
    header.addEventListener("click", () => {
      if (item.classList.contains("open")) {
        item.classList.remove("open");
      } else {
        openItem(idx);
      }

      stopAuto();
      resumeTimer = setTimeout(startAuto, RESUME);
    });
  });

  openItem(0);
  startAuto();
});
