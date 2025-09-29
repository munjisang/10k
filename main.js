// -------------------- 토스트 --------------------
const galleryIcon = document.querySelector(".gallery-icon");
const toast = document.getElementById("toast");
galleryIcon?.addEventListener("click", () => {
  toast?.classList.add("show");
  setTimeout(() => toast?.classList.remove("show"), 2500);
});

// -------------------- 배너 자동롤링 + 스와이프 --------------------
const bannerWrapper = document.querySelector('.banner-wrapper');
const slides = document.querySelectorAll('.banner-slide');
const currentNav = document.querySelector('.banner-navigation .current');
const totalNav = document.querySelector('.banner-navigation .total');

let currentIndex = 0;
const totalSlides = slides.length;
totalNav.textContent = totalSlides;

function updateBanner() {
  bannerWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
  currentNav.textContent = currentIndex + 1;
}

setInterval(() => {
  currentIndex = (currentIndex + 1) % totalSlides;
  updateBanner();
}, 3000);

let startX = 0;
let isDragging = false;

bannerWrapper?.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
  isDragging = true;
});
bannerWrapper?.addEventListener('touchmove', e => {
  if (!isDragging) return;
  const moveX = e.touches[0].clientX - startX;
  bannerWrapper.style.transform =
    `translateX(${ -currentIndex * 100 + moveX / bannerWrapper.offsetWidth * 100 }%)`;
});
bannerWrapper?.addEventListener('touchend', e => {
  isDragging = false;
  const diff = e.changedTouches[0].clientX - startX;
  if (diff > 50) currentIndex = Math.max(0, currentIndex - 1);
  else if (diff < -50) currentIndex = Math.min(totalSlides - 1, currentIndex + 1);
  updateBanner();
});

// -------------------- 중간 배너 랜덤 --------------------
const middleBanner = document.getElementById('middleBanner');
const banners = ['/img/middle_banner_1.png', '/img/middle_banner_2.png'];
if (middleBanner) middleBanner.src = banners[Math.floor(Math.random() * banners.length)];

// -------------------- 커스텀 드롭다운 --------------------
document.querySelectorAll(".custom-select").forEach(select => {
  const selected = select.querySelector(".selected");
  const optionsContainer = select.querySelector(".options");
  const optionsList = optionsContainer.querySelectorAll("li");

  selected.addEventListener("click", () => {
    const isOpen = select.classList.toggle("open");
    optionsContainer.style.display = isOpen ? "block" : "none";
  });

  optionsList.forEach(option => {
    option.addEventListener("click", () => {
      selected.textContent = option.dataset.value;
      select.classList.remove("open");
      optionsContainer.style.display = "none";
    });
  });

  document.addEventListener("click", e => {
    if (!select.contains(e.target)) {
      select.classList.remove("open");
      optionsContainer.style.display = "none";
    }
  });
});

// -------------------- 레시피 JSON 로드 --------------------
fetch('./data/recipe.json')
  .then(res => res.json())
  .then(data => {
    const list = data.recipes;

    // 리스트/그리드/가로 영역
    document.querySelectorAll('.list-items, .grid-items, .horizontal-items').forEach(area => {
      const count = parseInt(area.dataset.count, 10) || 0;
      const randomRecipes = list.sort(() => Math.random() - 0.5).slice(0, count);

      randomRecipes.forEach(recipe => {
        const item = document.createElement('div');
        let layout = '';

        if (area.classList.contains('list-items')) layout = 'list-item';
        else if (area.classList.contains('grid-items')) layout = 'grid-item';
        else layout = 'horizontal-item';

        item.className = layout;
        item.innerHTML = `
          <div class="${layout}-thumb">
            <img src="${recipe.cok_thumb}" alt="${recipe.food_name || recipe.cok_title}" class="thumb-img">
            <img src="/img/move.png" class="video-icon" style="display:${recipe.cok_video_src ? '' : 'none'};">
          </div>
          <div class="recipe-info">
            <div class="recipe-name">${recipe.cok_title}</div>
            <div class="recipe-chef">by. ${recipe.cok_reg_nm}</div>
            <div class="recipe-cook">
              <div class="cook-degree-wrap">
                <img src="/img/degree.png" alt="난이도">
                <span class="cook-degree">${recipe.cok_degree}</span>
              </div>
              <div class="cook-time-wrap">
                <img src="/img/time.png" alt="시간">
                <span class="cook-time">${recipe.cok_time}</span>
              </div>
            </div>
          </div>
        `;
        item.addEventListener('click', () =>
          window.open(`https://m.10000recipe.com/recipe/${recipe.cok_sq_board}`, '_blank')
        );
        area.appendChild(item);
      });
    });

    // -------------------- 숏츠 아코디언 --------------------
    const accordionArea = document.querySelector('.accordion-items');
    const maxAccCount = parseInt(accordionArea.dataset.count, 10) || 5;
    const accordionRecipes = list.sort(() => Math.random() - 0.5).slice(0, maxAccCount);

    accordionRecipes.forEach(recipe => {
      const accItem = document.createElement('div');
      accItem.className = 'accordion-item';
      accItem.innerHTML = `
        <div class="accordion-header">
          <img src="/img/search.png" class="accordion-icon">
          <span class="accordion-title">${recipe.food_name}</span>
          <img src="${recipe.cok_thumb}" class="accordion-thumb">
          <img src="/img/chevron_down.png" class="accordion-chevron">
        </div>
        <div class="accordion-body">
          <div class="recipe-info">
            <div class="recipe-name">${recipe.cok_title}</div>
            <div class="recipe-chef">by. ${recipe.cok_reg_nm}</div>
          </div>
          <img src="${recipe.cok_thumb}" class="accordion-body-thumb">
        </div>
      `;
      accordionArea.appendChild(accItem);
    });

    // ✅ 자동 롤링 + 1개만 열림
    const items = document.querySelectorAll(".accordion-item");
    let current = 0;
    let autoTimer;
    const INTERVAL = 5000;
    const RESUME = 5000;

    function closeAll() { items.forEach(i => i.classList.remove("open")); }
    function openItem(i) { closeAll(); items[i].classList.add("open"); current = i; }
    function startAuto() {
      autoTimer = setInterval(() => {
        const next = (current + 1) % items.length;
        openItem(next);
      }, INTERVAL);
    }
    function stopAuto() { clearInterval(autoTimer); }

    items.forEach((item, idx) => {
      const header = item.querySelector(".accordion-header");
      const body = item.querySelector(".accordion-body");

      header.addEventListener("click", () => {
        item.classList.contains("open") ? item.classList.remove("open") : openItem(idx);
        stopAuto();
        setTimeout(startAuto, INTERVAL);
      });

      body.addEventListener("click", e => {
        window.open(`https://m.10000recipe.com/recipe/${accordionRecipes[idx].cok_sq_board}`, "_blank");
        e.stopPropagation();
      });
    });

    openItem(0);
    startAuto();

    // -------------------- 인기검색어 아코디언 --------------------
    function initSearchAccordion() {
      const items = document.querySelectorAll(".search-accordion-item");
      let current = 0;
      let autoTimer;
      let resumeTimer;
      const INTERVAL = 5000;
      const RESUME = 5000;

      function closeAll() { items.forEach(i => i.classList.remove("open")); }
      function openItem(i) { closeAll(); items[i].classList.add("open"); current = i; }
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
          item.classList.contains("open") ? item.classList.remove("open") : openItem(idx);
          stopAuto();
          resumeTimer = setTimeout(startAuto, RESUME);
        });
      });

      openItem(0);
      startAuto();
    }

    initSearchAccordion();
  })
  .catch(err => console.error('레시피 로드 실패:', err));


// -------------------- 리뷰 JSON 로드 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".review-items");
  if (!container) return;

  const maxCount = parseInt(container.dataset.count, 10) || 5;

  // 🔹 리뷰 시간 포맷 함수
  function formatReviewDate(dateStr) {
    const now = new Date();
    const reviewDate = new Date(dateStr.replace(/-/g, "/"));
    const diffMs = now - reviewDate;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);

    if (diffMin < 60) return "방금";
    else if (diffHr < 12) return `${diffHr}시간전`;
    else {
      const yyyy = reviewDate.getFullYear();
      const mm = String(reviewDate.getMonth() + 1).padStart(2, "0");
      const dd = String(reviewDate.getDate()).padStart(2, "0");
      const hh = String(reviewDate.getHours()).padStart(2, "0");
      const min = String(reviewDate.getMinutes()).padStart(2, "0");
      return `${yy}.${mm}.${dd} ${hh}:${min}`;
    }
  }

fetch("./data/review.json")
  .then(res => res.json())
  .then(list => {
    const sorted = list.sort(
      (a, b) =>
        new Date(b.review_date.replace(/-/g, "/")) -
        new Date(a.review_date.replace(/-/g, "/"))
    );

    const topCandidates = sorted.slice(0, 10); 

    const reviews = topCandidates.sort(() => Math.random() - 0.5).slice(0, maxCount);

    reviews.forEach(r => {
      const item = document.createElement("div");
      item.className = "review-item";

      const reviewPhoto = r.review_thumb
        ? `<img src="${r.review_thumb}" alt="후기사진" class="review-photo">`
        : "";

      const displayDate = formatReviewDate(r.review_date);

      item.innerHTML = `
        <div class="review-info">
          <div class="review-item-thumb">
            <img src="${r.user_thumb}" alt="프로필사진">
          </div>
          <div class="review-user-info">
            <div class="review-user-name">${r.review_nickname}</div>
            <div class="review-date">${displayDate}</div>
          </div>
          <div class="review-rate-wrap">
            <img src="/img/star.png" alt="별점">
            <span class="review-rate">${r.review_rate}</span>
          </div>
        </div>

        <div class="review-text-wrap">
          <span class="review-text">${r.review_message}</span>
          ${reviewPhoto}
        </div>

        <div class="review-body">
          <div class="review-recipe-info">
            <div class="review-recipe-name">${r.cok_title}</div>
            <div class="review-recipe-chef">by. ${r.cok_reg_nm}</div>
          </div>
          <img src="${r.cok_thumb}" class="review-body-thumb" alt="레시피썸네일">
        </div>
      `;

      item.addEventListener("click", () => {
        window.open(`https://m.10000recipe.com/recipe/${r.cok_sq_board}`, "_blank");
      });

      container.appendChild(item);
    });
  })
  .catch(err => console.error("리뷰 로드 실패:", err));
});
