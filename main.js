// -------------------- 검색창 검색 기능 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector('.search-bar input');
  const searchIcon = document.querySelector('.search-bar .search-icon');

  if (!searchInput || !searchIcon) return;

  function goSearch() {
    const query = searchInput.value.trim();
    if (!query) return;
    
    window.location.href = `https://m.10000recipe.com/recipe/list.html?q=${encodeURIComponent(query)}`;

    searchInput.value = '';
    searchInput.placeholder = '레시피 또는 재료명 입력';
  }

  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') goSearch();
  });

  searchIcon.addEventListener('click', goSearch);
});

// -------------------- 헤더 알림 클릭 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const alarmIcon = document.querySelector('.header-icons .icon');
  if (!alarmIcon) return;

  alarmIcon.addEventListener('click', () => {
    window.location.href = 'https://m.10000recipe.com/profile/alim2.html';
  });
});

// -------------------- 갤러리 오버레이 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const galleryIcon = document.querySelector('.search-bar .gallery-icon');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchBottomSheet = searchOverlay?.querySelector('.bottom-sheet');
  const closeBtn = searchOverlay?.querySelector('.sheet-area-icon');
  const recipeRegister = document.querySelector('.recipe-register');
  const bottomNavigation = document.querySelector('.bottom-navigation');

  if (!galleryIcon || !searchOverlay || !searchBottomSheet || !closeBtn) return;

  galleryIcon.addEventListener('click', () => {
    searchOverlay.style.display = 'block';
    searchBottomSheet.classList.add('show');
    if (recipeRegister) recipeRegister.style.display = 'none';
    if (bottomNavigation) bottomNavigation.style.display = 'none';
  });

  closeBtn.addEventListener('click', () => {
    searchBottomSheet.classList.remove('show');
    searchOverlay.style.display = 'none';
    if (recipeRegister) recipeRegister.style.display = 'flex';
    if (bottomNavigation) bottomNavigation.style.display = 'flex';
  });

  searchOverlay.addEventListener('click', e => {
    if (e.target === searchOverlay) {
      searchBottomSheet.classList.remove('show');
      searchOverlay.style.display = 'none';
      if (recipeRegister) recipeRegister.style.display = 'flex';
      if (bottomNavigation) bottomNavigation.style.display = 'flex';
    }
  });
});

// -------------------- 배너 자동롤링 + 스와이프 --------------------
const bannerWrapper = document.querySelector('.banner-wrapper');
if (bannerWrapper) {
  const slides = document.querySelectorAll('.banner-slide');
  const currentNav = document.querySelector('.banner-navigation .current');
  const totalNav = document.querySelector('.banner-navigation .total');
  let currentIndex = 0;
  const totalSlides = slides.length;
  if (totalNav) totalNav.textContent = totalSlides;

  function updateBanner() {
    bannerWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    if (currentNav) currentNav.textContent = currentIndex + 1;
  }

  setInterval(() => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateBanner();
  }, 3000);

  let startX = 0;
  let isDragging = false;

  bannerWrapper.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  bannerWrapper.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const moveX = e.touches[0].clientX - startX;
    bannerWrapper.style.transform =
      `translateX(${ -currentIndex * 100 + moveX / bannerWrapper.offsetWidth * 100 }%)`;
  });

  bannerWrapper.addEventListener('touchend', e => {
    isDragging = false;
    const diff = e.changedTouches[0].clientX - startX;
    if (diff > 50) currentIndex = Math.max(0, currentIndex - 1);
    else if (diff < -50) currentIndex = Math.min(totalSlides - 1, currentIndex + 1);
    updateBanner();
  });
}

// -------------------- 중간 배너 랜덤 --------------------
const middleBanner = document.getElementById('middleBanner');
const middleBannerLink = document.getElementById('middleBannerLink');
if (middleBanner && middleBannerLink) {
  const banners = [
    { src: './img/middle_banner_1.png', link: 'https://timingapp.onelink.me/uEn0/4jc12k0n', target: '_blank' },
    { src: './img/middle_banner_2.png', link: 'https://m.10000recipe.com/chef/celeb_list.html', target: '_self' }
  ];
  const randomBanner = banners[Math.floor(Math.random() * banners.length)];
  middleBanner.src = randomBanner.src;
  middleBannerLink.href = randomBanner.link;
  middleBannerLink.target = randomBanner.target; 
}

// -------------------- 레시피 등록 오버레이 --------------------
const registerBtn = document.querySelector(".recipe-register");
const recipeOverlay = document.getElementById("recipeOverlay");
const recipeBottomSheet = recipeOverlay?.querySelector(".bottom-sheet");
const bottomNavigation = document.querySelector(".bottom-navigation");

if (registerBtn && recipeOverlay && recipeBottomSheet && bottomNavigation) {
  registerBtn.addEventListener("click", () => {
    recipeOverlay.style.display = "block"; 
    recipeBottomSheet.classList.add("show"); 
    registerBtn.style.display = "none"; 
    bottomNavigation.style.display = "none"; 
  });

  recipeOverlay.addEventListener("click", e => {
    if (e.target === recipeOverlay) {
      recipeBottomSheet.classList.remove("show");
      recipeOverlay.style.display = "none"; 
      registerBtn.style.display = "flex"; 
      bottomNavigation.style.display = "flex"; 
    }
  });

  const closeBtnRecipe = recipeOverlay.querySelector(".sheet-area-icon");
  closeBtnRecipe?.addEventListener("click", () => {
    recipeBottomSheet.classList.remove("show");
    recipeOverlay.style.display = "none"; 
    registerBtn.style.display = "flex"; 
    bottomNavigation.style.display = "flex"; 
  });
}

// -------------------- KADX --------------------
document.addEventListener("DOMContentLoaded", () => {
  const kaContainer = document.querySelector(".ka-items");
  const prevBtn = document.querySelector(".page-btn.prev");
  const nextBtn = document.querySelector(".page-btn.next");
  const pageInfo = document.querySelector(".page-info");

  if (!kaContainer || !prevBtn || !nextBtn || !pageInfo) return;

  const itemsPerPage = 2;
  let currentPage = 1;
  let totalPages = 1;
  let kaData = [];

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function renderPage(page) {
    kaContainer.innerHTML = "";
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = kaData.slice(start, end);

    pageItems.forEach(item => {
      const diffClass = item["kadx-price-ud"] === "down" ? "ka-price-down" : "ka-price-up";

      const card = document.createElement("div");
      card.classList.add("ka-item");

      card.innerHTML = `
        <div class="ka-item-product">
          <img src="${item["kadx-item-img"]}" alt="${item["kadx-item-name"]}" class="ka-item-thumb">
          <div class="ka-item-info">
            <div class="ka-item-name">${item["kadx-item-name"]}</div>
            <div class="ka-item-price">
              <span class="ka-price-value">${item["kadx-price-value"]}</span>
              <span class="ka-price-unit">${item["kadx-price-unit"]}</span>
            </div>
            <div class="${diffClass}">${item["kadx-price"]}</div>
          </div>
        </div>
        <div class="ka-item-history">
          <div class="ka-history-row">
            <span class="ka-history-label">10일전</span>
            <span class="ka-history-value">${item["kadx-history-d"]}</span>
          </div>
          <div class="ka-history-row">
            <span class="ka-history-label">전월</span>
            <span class="ka-history-value">${item["kadx-history-m"]}</span>
          </div>
          <div class="ka-history-row">
            <span class="ka-history-label">전년</span>
            <span class="ka-history-value">${item["kadx-history-y"]}</span>
          </div>
        </div>
      `;

      card.addEventListener("click", () => {
        window.open(`https://m.10000recipe.com/recipe/kadx.html?cate=&pno=${item.kadx_seq}`, "_self");
      });

      kaContainer.appendChild(card);
    });

    const itemHeight = kaContainer.querySelector(".ka-item")?.offsetHeight || 0;
    kaContainer.style.minHeight = `${itemHeight * itemsPerPage}px`;

    pageInfo.textContent = `${currentPage} / ${totalPages}`;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  function goPage(page) {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    currentPage = page;
    renderPage(currentPage);
  }

  prevBtn.addEventListener("click", () => goPage(currentPage - 1));
  nextBtn.addEventListener("click", () => goPage(currentPage + 1));

  fetch("./data/kadx.json")
    .then(res => res.json())
    .then(data => {
      kaData = shuffle(data); 
      totalPages = Math.ceil(kaData.length / itemsPerPage);
      renderPage(currentPage); 
    })
    .catch(err => console.error("KADX 데이터 로드 실패:", err));
});

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
            <img src="./img/move.png" class="video-icon" style="display:${recipe.cok_video_src ? '' : 'none'};">
          </div>
          <div class="recipe-info">
            <div class="recipe-name">${recipe.cok_title}</div>
            <div class="recipe-chef">by. ${recipe.cok_reg_nm}</div>
            <div class="recipe-cook">
              <div class="cook-degree-wrap">
                <img src="./img/degree.png" alt="난이도">
                <span class="cook-degree">${recipe.cok_degree}</span>
              </div>
              <div class="cook-time-wrap">
                <img src="./img/time.png" alt="시간">
                <span class="cook-time">${recipe.cok_time}</span>
              </div>
            </div>
          </div>
        `;
        item.addEventListener('click', () =>
          window.open(`https://m.10000recipe.com/recipe/${recipe.cok_sq_board}`, '_self')
        );
        area.appendChild(item);
      });
    });

    // -------------------- 숏츠 아코디언 --------------------
    const accordionArea = document.querySelector('.accordion-items');
    if (accordionArea) {
      const maxAccCount = parseInt(accordionArea.dataset.count, 10) || 5;
      const accordionRecipes = list.sort(() => Math.random() - 0.5).slice(0, maxAccCount);

      accordionRecipes.forEach(recipe => {
        const accItem = document.createElement('div');
        accItem.className = 'accordion-item';
        accItem.innerHTML = `
          <div class="accordion-header">
            <img src="./img/search.png" class="accordion-icon">
            <span class="accordion-title">${recipe.food_name}</span>
            <img src="${recipe.cok_thumb}" class="accordion-thumb">
            <img src="./img/chevron_down.png" class="accordion-chevron">
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

      const items = accordionArea.querySelectorAll(".accordion-item");
      let current = 0;
      let autoTimer;
      const INTERVAL = 5000;

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
          window.open(`https://m.10000recipe.com/recipe/${accordionRecipes[idx].cok_sq_board}`, "_self");
          e.stopPropagation();
        });
      });

      openItem(0);

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) startAuto();
          else stopAuto();
        });
      }, { threshold: 0.5 });
      observer.observe(accordionArea);
    }

    // -------------------- 인기검색어 아코디언 --------------------
    function initSearchAccordion() {
      const container = document.querySelector(".search-accordion-items");
      const items = container ? container.querySelectorAll(".search-accordion-item") : [];
      if (!container || items.length === 0) return;

      let current = 0;
      let autoTimer = null;
      const INTERVAL = 5000;

      function closeAll() {
        items.forEach(i => i.classList.remove("open"));
      }

      function openItem(i) {
        closeAll();
        items[i].classList.add("open");
        current = i;
      }

      function startAuto() {
        if (autoTimer) return;
        autoTimer = setInterval(() => {
          const next = (current + 1) % items.length;
          openItem(next);
        }, INTERVAL);
      }

      function stopAuto() {
        clearInterval(autoTimer);
        autoTimer = null;
      }

      items.forEach((item, idx) => {
        const header = item.querySelector(".search-accordion-header");
        if (!header) return;

        header.addEventListener("click", () => {
          if (item.classList.contains("open")) {
            item.classList.remove("open");
          } else {
            openItem(idx);
          }
          stopAuto();
          setTimeout(startAuto, INTERVAL);
        });
      });

      openItem(0);

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              startAuto();
            } else {
              stopAuto();
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(container);
    }
    initSearchAccordion();
  }) 
  .catch(err => console.error('레시피 로드 실패:', err));


// -------------------- 리뷰 JSON 로드 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".review-items");
  if (!container) return;

  const maxCount = parseInt(container.dataset.count, 10) || 5;

  function formatReviewDate(dateStr) {
    const now = new Date();
    const reviewDate = new Date(dateStr.replace(/-/g, "/")); 
    const diffMs = now - reviewDate;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);

    if (diffMin < 60) return "방금";
    else if (diffHr < 12) return `${diffHr}시간전`;
    else {
      const yy = String(reviewDate.getFullYear()).slice(2);
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
      const sorted = list.sort((a, b) =>
        new Date(b.review_date.replace(/-/g, "/")) -
        new Date(a.review_date.replace(/-/g, "/"))
      );

      const topCandidates = sorted.slice(0, 10);

      const randomFive = topCandidates
        .sort(() => Math.random() - 0.5)
        .slice(0, maxCount);

      const reviews = randomFive.sort((a, b) =>
        new Date(b.review_date.replace(/-/g, "/")) -
        new Date(a.review_date.replace(/-/g, "/"))
      );

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
              <img src="./img/star.png" alt="별점">
              <span class="review-rate">${r.review_rate}</span>
            </div>
          </div>

          <div class="review-text-wrap">
            <span class="review-text">${r.review_message}</span>
            ${reviewPhoto}
          </div>
          <div class="review-body">
            <div class="review-recipe-name">${r.cok_title}
            </div>          
          </div>
        `;

        item.addEventListener("click", () => {
          window.open(`https://m.10000recipe.com/recipe/${r.cok_sq_board}`, "_self");
        });

        container.appendChild(item);
      });
    })
    .catch(err => console.error("리뷰 로드 실패:", err));
});

// -------------------- bottom-navigation 스크롤 이벤트 -------------------
document.addEventListener("DOMContentLoaded", () => {
  const bottomNav = document.querySelector(".bottom-navigation");
  const recipeRegister = document.querySelector(".recipe-register");

  if (!bottomNav) return; 

  let lastScrollY = window.scrollY;
  let scrollTimer;

  function hideBars() {
    bottomNav.classList.add("hidden");
    if (recipeRegister) recipeRegister.classList.add("hidden");
  }

  function showBars() {
    bottomNav.classList.remove("hidden");
    if (recipeRegister) recipeRegister.classList.remove("hidden");
  }

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY + 5) {
      hideBars();
    } else if (currentScrollY < lastScrollY - 5) {
      showBars();
    }

    lastScrollY = currentScrollY;

    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      showBars();
    }, 500);
  });
});

// -------------------- chef JSON 로드 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const chefContainer = document.querySelector(".chef-items");
  if (!chefContainer) return;

  const displayCount = parseInt(chefContainer.dataset.count, 10) || 5;

  function formatNumber(num) {
    let n = parseInt(String(num).replace(/,/g, ''), 10);
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return n.toString();
  }

  fetch("./data/chef.json")
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data)) return;

      const shuffled = data.sort(() => Math.random() - 0.5);

      const chefsToShow = shuffled.slice(0, displayCount);

      chefsToShow.forEach(item => {
        const chefItem = document.createElement("div");
        chefItem.className = "chef-item";

        let snsHtml = '';
        if (item["chef-instargram"]) snsHtml += `<img src="./img/instar.png" alt="인스타그램" class="sns-icon" data-link="${item["chef-instargram"]}">`;
        if (item["chef-youtube"]) snsHtml += `<img src="./img/youtube.png" alt="유튜브" class="sns-icon" data-link="${item["chef-youtube"]}">`;
        if (item["chef-blog"]) snsHtml += `<img src="./img/blog.png" alt="블로그" class="sns-icon" data-link="${item["chef-blog"]}">`;
        if (item["chef-link"]) snsHtml += `<img src="./img/link.png" alt="기타" class="sns-icon" data-link="${item["chef-link"]}">`;

        let activeText = '';
        if (item["chef-active"] === 1) activeText = "최근활동 셰프";
        else if (item["chef-active"] === 2) activeText = "새로운 셰프";

        chefItem.innerHTML = `
          <div class="chef-active">${activeText}</div>
          <div class="chef-item-thumb">
            <img src="${item["chef-img"]}" alt="profile" class="thumb-img">
          </div>
          <div class="chef-info">
            <div class="chef-name">${item["chef-name"]}</div>
            <div class="chef-cook">
              <div class="chef-reg-wrap">
                <img src="./img/food.png" alt="레시피수">
                <span class="chef-reg">${formatNumber(item["chef-food"])}</span>
              </div>
              <div class="chef-flow-wrap">
                <img src="./img/user.png" alt="팔로워수">
                <span class="chef-flow">${formatNumber(item["chef-fllower"])}</span>
              </div>
            </div>
          </div>
<!--
          <div class="chef-sns-wrap">
            ${snsHtml}
          </div>
-->
        `;

        chefItem.addEventListener("click", (e) => {
          if (e.target.classList.contains("sns-icon")) return;
          window.open(`https://m.10000recipe.com/profile/recipe.html?uid=${item.chef_seq}`, '_self');
        });

        chefItem.querySelectorAll(".sns-icon").forEach(icon => {
          icon.addEventListener("click", (e) => {
            e.stopPropagation();
            const link = icon.getAttribute("data-link");
            if (link) window.open(link, "_blank");
          });
        });

        chefContainer.appendChild(chefItem);
      });
    })
    .catch(err => console.error("chef.json 로드 실패:", err));
});

// -------------------- 하단 네비게이션 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".bottom-navigation .nav-item");
  if (!navItems.length) return;

  let currentPage = window.location.pathname.split("/").pop();
  if (!currentPage || currentPage === "") currentPage = "index.html";

  const pages = [
    "index.html",
    "scrap.html",
    "category.html",
    "shopping.html",
    "my.html"
  ];

  const setIconState = (icon, active) => {
    if (!icon) return;
    const newSrc = icon.src.replace(/_on\.svg|_off\.svg/, active ? "_on.svg" : "_off.svg");
    icon.src = newSrc;
  };

  navItems.forEach((item, idx) => {
    const page = pages[idx];
    const icon = item.querySelector("img");
    if (currentPage === page) {
      item.classList.add("active");
      setIconState(icon, true);
    } else {
      setIconState(icon, false);
    }
  });

  navItems.forEach((item, idx) => {
    item.addEventListener("click", () => {
      const target = pages[idx];
      if (currentPage === target) return;
      window.location.href = target;
    });
  });
});

// -------------------- 인기 검색어 - 레시피 더보기 이동 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const moreButtons = document.querySelectorAll(".search-more-btn");

  moreButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // 버튼이 속한 아코디언 아이템 찾기
      const accordionItem = btn.closest(".search-accordion-item");
      if (!accordionItem) return;

      // 해당 항목의 제목 텍스트 가져오기
      const titleElem = accordionItem.querySelector(".search-accordion-title");
      if (!titleElem) return;

      const query = titleElem.textContent.trim();

      // URL 생성 및 이동
      const targetUrl = `https://m.10000recipe.com/recipe/list.html?q=${encodeURIComponent(query)}`;
      window.location.href = targetUrl;
    });
  });
});

// -------------------- folder_edit 이동 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const folderEditBtn = document.querySelector(".folder-edit-wrap");
  if (folderEditBtn) {
    folderEditBtn.addEventListener("click", () => {
      window.location.href = "folder_edit.html";
    });
  }
});

// -------------------- scrap_edit 이동 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const folderEditBtn = document.querySelector(".scrap-edit");
  if (folderEditBtn) {
    folderEditBtn.addEventListener("click", () => {
      window.location.href = "scrap_edit.html";
    });
  }
});

// -------------------- 스크랩 폴더 활성화 전환 + list-items 갱신 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const folders = document.querySelectorAll(".folder-list > div");
  const folderList = document.querySelector(".folder-list");
  const scrapArea = document.querySelector(".scrap-area");
  const listItems = document.querySelector(".scrap-area .list-items");
  const nodata = document.querySelector(".scrap-area-nodata");
  const scrapCountElem = document.querySelector(".scrap-count");

  if (!scrapArea || !listItems || !nodata || !scrapCountElem) return;

  let recipeList = [];

  // ✅ fetch 완료 후 초기 폴더 클릭 실행
  fetch('./data/recipe.json')
    .then(res => res.json())
    .then(data => {
      recipeList = data.recipes || [];

      // ✅ 레시피 로드 완료 후 초기 폴더 클릭
      const initialFolder = document.querySelector(".folder-active");
      if (initialFolder) initialFolder.click();
    })
    .catch(err => console.error('레시피 로드 실패:', err));

  folders.forEach(folder => {
    folder.addEventListener("click", () => {
      // 폴더 상태 초기화
      folders.forEach(f => {
        f.className = "folder-nonactive";
        const name = f.querySelector("span");
        const count = f.querySelector("div");
        if (name && count) {
          name.className = "folder-nonactive-name";
          count.className = "folder-nonactive-count";
        }
      });

      folder.className = "folder-active";
      const name = folder.querySelector("span");
      const countDiv = folder.querySelector("div");
      if (name && countDiv) {
        name.className = "folder-active-name";
        countDiv.className = "folder-active-count";
      }

      let count = parseInt(countDiv?.textContent.replace("+", ""), 10);
      if (isNaN(count)) count = 0;
      listItems.setAttribute("data-count", count);
      scrapCountElem.textContent = `레시피 ${count}개`;

      if (count === 0) {
        scrapArea.style.display = "none";
        nodata.style.display = "flex";
      } else {
        scrapArea.style.display = "flex";
        nodata.style.display = "none";
      }

      const folderRect = folder.getBoundingClientRect();
      const listRect = folderList.getBoundingClientRect();
      const offset = folderRect.left - listRect.left - (listRect.width / 4) + (folderRect.width / 2);
      folderList.scrollBy({ left: offset, behavior: "smooth" });

      window.scrollTo({ top: 90, behavior: "smooth" });

      listItems.innerHTML = "";
      const recipesToShow = recipeList.sort(() => Math.random() - 0.5).slice(0, count);

      recipesToShow.forEach(recipe => {
        const item = document.createElement("div");
        item.className = "list-item";
        item.innerHTML = `
          <div class="list-item-thumb">
            <img src="${recipe.cok_thumb}" alt="${recipe.food_name || recipe.cok_title}" class="thumb-img">
            <img src="./img/move.png" class="video-icon" style="display:${recipe.cok_video_src ? '' : 'none'};">
          </div>
          <div class="recipe-info">
            <div class="recipe-name">${recipe.cok_title}</div>
            <div class="recipe-chef">by. ${recipe.cok_reg_nm}</div>
            <div class="recipe-cook">
              <div class="cook-degree-wrap">
                <img src="./img/degree.png" alt="난이도">
                <span class="cook-degree">${recipe.cok_degree}</span>
              </div>
              <div class="cook-time-wrap">
                <img src="./img/time.png" alt="시간">
                <span class="cook-time">${recipe.cok_time}</span>
              </div>
            </div>
          </div>
        `;
        item.addEventListener("click", () =>
          window.open(`https://m.10000recipe.com/recipe/${recipe.cok_sq_board}`, "_self")
        );
        listItems.appendChild(item);
      });
    });
  });
});

// -------------------- 폴더추가 바텀시트 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const bottomSheetOverlay = document.querySelector(".folder-add-overlay");
  const bottomSheet = document.querySelector(".folder-add");
  const cancelBtn = document.querySelector(".folder-add-cancel");
  const addBtn = document.querySelector(".folder-add-add");
  const input = document.querySelector(".folder-add-input");

  const folderAdd = document.querySelector(".folder-addbtn"); 
  const pageAdd = document.querySelector(".page-add"); 

  const openSheet = () => {
    bottomSheetOverlay.style.display = "flex";
    setTimeout(() => {
      bottomSheet.classList.add("show");
      input.focus(); 
    }, 100);
    input.value = "";
    updateAddButtonState();
  };

  const closeSheet = () => {
    bottomSheet.classList.remove("show");
    setTimeout(() => (bottomSheetOverlay.style.display = "none"), 300);
  };

  const updateAddButtonState = () => {
    const hasText = input.value.trim().length > 0;
    addBtn.disabled = !hasText;
    addBtn.classList.toggle("active", hasText);
  };
  input.addEventListener("input", updateAddButtonState);

  cancelBtn.addEventListener("click", closeSheet);

  addBtn.addEventListener("click", () => {
    if (addBtn.disabled) return;
    const folderName = input.value.trim();
    closeSheet();

    let toast = document.getElementById("toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      document.body.appendChild(toast);
    }
    toast.classList.remove("show");
    void toast.offsetWidth;
    toast.textContent = `"${folderName}" 폴더가 추가되었습니다.`;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  });

  bottomSheetOverlay.addEventListener("click", (e) => {
    if (e.target === bottomSheetOverlay) closeSheet();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && bottomSheetOverlay.style.display === "flex") {
      closeSheet();
    }
  });

  if (folderAdd) folderAdd.addEventListener("click", openSheet);
  if (pageAdd) pageAdd.addEventListener("click", openSheet);
});

// -------------------- 안드로이드 뒤로가기 오버레이 제어 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const overlays = [
    document.querySelector(".folder-add-overlay"),
    document.getElementById("searchOverlay"),
    document.getElementById("recipeOverlay")
  ].filter(Boolean);

  // 각 오버레이마다 closeOverlay 이벤트 연결
  overlays.forEach(overlay => {
    overlay.addEventListener("closeOverlay", () => {
      if (overlay === document.querySelector(".folder-add-overlay")) {
        const bottomSheet = document.querySelector(".folder-add");
        bottomSheet.classList.remove("show");
        setTimeout(() => overlay.style.display = "none", 300);
      } else if (overlay.id === "searchOverlay") {
        const bottomSheet = overlay.querySelector(".bottom-sheet");
        bottomSheet.classList.remove("show");
        overlay.style.display = "none";
        const recipeRegister = document.querySelector('.recipe-register');
        const bottomNav = document.querySelector('.bottom-navigation');
        if (recipeRegister) recipeRegister.style.display = 'flex';
        if (bottomNav) bottomNav.style.display = 'flex';
      } else if (overlay.id === "recipeOverlay") {
        const bottomSheet = overlay.querySelector(".bottom-sheet");
        bottomSheet.classList.remove("show");
        overlay.style.display = "none";
        const registerBtn = document.querySelector(".recipe-register");
        const bottomNav = document.querySelector(".bottom-navigation");
        if (registerBtn) registerBtn.style.display = 'flex';
        if (bottomNav) bottomNav.style.display = 'flex';
      }
    });

    // overlay가 열리면 history push
    const observer = new MutationObserver(() => {
      if (overlay.style.display === "flex" || overlay.style.display === "block") {
        history.pushState({ overlay: true }, "");
      }
    });
    observer.observe(overlay, { attributes: true, attributeFilter: ["style"] });
  });

  // 뒤로가기 감지
  window.addEventListener("popstate", (e) => {
    const anyOpen = overlays.find(o => o.style.display === "flex" || o.style.display === "block");
    if (anyOpen) {
      e.preventDefault?.();
      anyOpen.dispatchEvent(new Event("closeOverlay"));
      history.pushState({}, ""); // 뒤로가기 막기
    }
  });
});