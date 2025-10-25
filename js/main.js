// -------------------- 헤더 알림 / 설정 클릭 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const headerIcons = document.querySelectorAll('.header-icons .icon');
  if (!headerIcons.length) return;

  headerIcons.forEach(icon => {
    const altText = icon.getAttribute('alt');

    if (altText.includes('알림')) {
      // 알림 아이콘 클릭 시
      icon.addEventListener('click', () => {
        window.location.href = 'https://m.10000recipe.com/profile/alim2.html';
      });
    } else if (altText.includes('설정')) {
      // 설정 아이콘 클릭 시
      icon.addEventListener('click', () => {
        window.location.href = './setting.html';
      });
    }
  });
});

// -------------------- 검석페이지 이동 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const folderEditBtn = document.querySelector(".search-bar");
  if (folderEditBtn) {
    folderEditBtn.addEventListener("click", () => {
      window.location.href = "search.html";
    });
  }
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

// -------------------- index.html 카테고리 8개 랜덤 생성 --------------------
document.addEventListener("DOMContentLoaded", async () => {
  const menuContainer = document.getElementById("random-category-list");
  if (!menuContainer) return;

  try {
    // category.json 불러오기
    const response = await fetch("./data/category.json");
    if (!response.ok) throw new Error("category.json을 불러올 수 없습니다.");
    const categories = await response.json();

    // 모든 소분류(sub)만 추출
    const allSubCategories = categories.flatMap(cat => cat.sub || []);

    // 데이터가 부족할 경우 처리
    if (allSubCategories.length === 0) {
      console.warn("소분류 데이터가 없습니다.");
      menuContainer.innerHTML = "<p>카테고리 데이터를 불러올 수 없습니다.</p>";
      return;
    }

    // Fisher–Yates Shuffle로 랜덤 섞기
    for (let i = allSubCategories.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allSubCategories[i], allSubCategories[j]] = [allSubCategories[j], allSubCategories[i]];
    }

    // 랜덤 8개 선택
    const randomEight = allSubCategories.slice(0, 8);

    // HTML 구성
    const html = randomEight.map(sub => {
      const parentCategory = categories.find(cat =>
        cat.sub?.some(s => s.sub_category_seq === sub.sub_category_seq)
      );

      const categoryName = parentCategory ? parentCategory.category_name : "기타";

      return `
        <a href="./category_list.html?category=${encodeURIComponent(categoryName)}&sub=${encodeURIComponent(sub.sub_category_name)}" class="menu-item">
          <img src="${sub.sub_category_thumb}" alt="${sub.sub_category_name}">
          <span>${sub.sub_category_name}</span>
        </a>
      `;
    }).join("");

    // DOM에 삽입
    menuContainer.innerHTML = html;

  } catch (error) {
    console.error("카테고리 데이터를 불러오는 중 오류 발생:", error);
    menuContainer.innerHTML = "<p>카테고리 로드 중 오류가 발생했습니다.</p>";
  }
});

// -------------------- 레시피 JSON 로드 --------------------
fetch('./data/recipe.json')
  .then(res => res.json())
  .then(data => {
    const list = data.recipes;

    document.querySelectorAll('.list-items, .grid-items, .horizontal-items, .horizon-items').forEach(area => {
      const count = parseInt(area.dataset.count, 10) || 0;
      const randomRecipes = list.sort(() => Math.random() - 0.5).slice(0, count);

      randomRecipes.forEach(recipe => {
        const item = document.createElement('div');
        let layout = '';

        if (area.classList.contains('list-items')) layout = 'list-item';
        else if (area.classList.contains('grid-items')) layout = 'grid-item';
        else if (area.classList.contains('horizon-items')) layout = 'horizon-item';
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

  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
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
          <div class="chef-add-btn">소식받기</div>
        `;

        // 버튼 클릭 이벤트
        const addBtn = chefItem.querySelector(".chef-add-btn");
        addBtn.addEventListener("click", (e) => {
          e.stopPropagation(); // 부모 클릭 이벤트 방지
          const chefName = item["chef-name"];
          if (addBtn.classList.contains("chef-add-btn")) {
            // 소식받기 → 소식받는중
            addBtn.classList.remove("chef-add-btn");
            addBtn.classList.add("chef-add-flow");
            addBtn.textContent = "소식받는중";
            showToast(`${chefName}님의 새로운 소식을 알려드릴께요.`);
          } else {
            // 소식받는중 → 소식받기
            addBtn.classList.remove("chef-add-flow");
            addBtn.classList.add("chef-add-btn");
            addBtn.textContent = "소식받기";
            showToast(`${chefName}님의 소식받기를 취소 했어요.`);
          }
        });

        chefItem.addEventListener("click", (e) => {
          if (e.target.classList.contains("sns-icon") || e.target === addBtn) return;
          window.open(`https://m.10000recipe.com/profile/recipe.html?uid=${item.chef_seq}`, '_self');
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

// -------------------- 카테고리 전체 페이지 스크롤 제한 --------------------
if (window.location.pathname.includes("category.html")) {
  document.body.style.overflow = "hidden"; // body 스크롤 활성화
}

// -------------------- 카테고리 목록 스크롤 처리 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const rightPanel = document.querySelector(".category-right");
  const leftPanel = document.querySelector(".category-left");
  const bottomNav = document.querySelector(".bottom-navigation");

  if (!rightPanel || !bottomNav) return;

  // 바텀네비 높이 자동 계산 (없을 경우 기본값 80)
  const bottomHeight = bottomNav.offsetHeight || 80;

  // 안전영역(Safe area)까지 포함한 padding-bottom 적용
  const safePadding = `calc(${bottomHeight + 140}px + env(safe-area-inset-bottom))`;

  rightPanel.style.paddingBottom = safePadding;
  if (leftPanel) leftPanel.style.paddingBottom = safePadding;

  // 혹시 리사이즈 시에도 대응 (안드로이드/iOS 가로모드 전환 대비)
  window.addEventListener("resize", () => {
    const newHeight = bottomNav.offsetHeight || 80;
    const updatedPadding = `calc(${newHeight + 140}px + env(safe-area-inset-bottom))`;
    rightPanel.style.paddingBottom = updatedPadding;
    if (leftPanel) leftPanel.style.paddingBottom = updatedPadding;
  });
});

// -------------------- 카테고리 목록 구성 --------------------
document.addEventListener("DOMContentLoaded", async () => {
  const leftPanel = document.getElementById("category-left");
  const rightPanel = document.getElementById("category-right");

  let subCategoryContainer = rightPanel.querySelector(".sub-category-items");
  if (!subCategoryContainer) {
    subCategoryContainer = document.createElement("div");
    subCategoryContainer.className = "sub-category-items";
    rightPanel.appendChild(subCategoryContainer);
  }

  try {
    const response = await fetch("./data/category.json");
    const data = await response.json();

    if (!data || data.length === 0) return;

    data.forEach((category, index) => {
      const item = document.createElement("div");
      item.className = "category-left-item";
      item.textContent = category.category_name;

      item.addEventListener("click", () => {
        document.querySelectorAll(".category-left-item").forEach(el => el.classList.remove("active"));
        item.classList.add("active");
        renderSubCategories(category.category_name, category.sub);
        rightPanel.scrollTo({ top: 0, behavior: "smooth" });
      });

      if (index === 0) {
        item.classList.add("active");
        renderSubCategories(category.category_name, category.sub);
      }

      leftPanel.appendChild(item);
    });

  } catch (err) {
    console.error("❌ 카테고리 데이터를 불러오는 중 오류 발생:", err);
  }

  function renderSubCategories(categoryName, subList) {
    const bannerArea = rightPanel.querySelector(".category-banner-area");
    let subCategoryContainer = rightPanel.querySelector(".sub-category-items");
    if (!subCategoryContainer) {
      subCategoryContainer = document.createElement("div");
      subCategoryContainer.className = "sub-category-items";
      rightPanel.appendChild(subCategoryContainer);
    }
    subCategoryContainer.innerHTML = "";

    subList.forEach(sub => {
      const a = document.createElement("a");
      a.href = `./category_list.html?category=${encodeURIComponent(categoryName)}&sub=${encodeURIComponent(sub.sub_category_name)}`;
      a.className = "sub-category-item";
      a.target = "_self";

      a.innerHTML = `
        <img src="${sub.sub_category_thumb}" alt="${sub.sub_category_name}" class="sub-category-thumb">
        <span class="sub-category-name">${sub.sub_category_name}</span>
      `;

      subCategoryContainer.appendChild(a);
    });

    if (bannerArea && bannerArea.nextSibling !== subCategoryContainer) {
      rightPanel.querySelector(".category-right-wrapper").insertBefore(subCategoryContainer, bannerArea.nextSibling);
    }
  }
});

// -------------------- 장보기 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const itemChips = document.querySelectorAll(".item-chip");
  const shoppingLists = document.querySelector(".shopping-lists");
  const shoppingArea = document.querySelector(".shopping-area");
  const shoppingAreaNoData = document.querySelector(".shopping-area-nodata");
  const input = document.querySelector(".item-bar input");
  const addBtn = document.querySelector(".add-btn");
  const toast = document.getElementById("toast");

  // 🧾 다이얼로그 관련 요소
  const dialog = document.querySelector(".shopping-dialog-overlay");
  const dialogDesc = dialog.querySelector(".shopping-dialog-desc");
  const cancelBtn = dialog.querySelector(".shopping-dialog-cancel");
  const deleteBtn = dialog.querySelector(".shopping-dialog-delete");
  const dialogTitle = dialog.querySelector(".shopping-dialog-title");

  // ✅ 토스트 메시지
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }

  // ✅ 쿠키 처리
  function setCookie(name, value, days = 30) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/`;
  }

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return decodeURIComponent(match[2]);
    return null;
  }

  function saveShoppingListToCookie() {
    const items = Array.from(shoppingLists.children).map(listItem => {
      const textDiv = listItem.querySelector(".shopping-list-txt, .shopping-list-complete");
      const isChecked = textDiv.classList.contains("shopping-list-complete");
      return { name: textDiv.textContent.trim(), checked: isChecked };
    });
    setCookie("shoppingList", JSON.stringify(items));
  }

  function loadShoppingListFromCookie() {
    const cookieData = getCookie("shoppingList");
    if (!cookieData) return;
    const items = JSON.parse(cookieData);
    items.forEach(item => {
      const newItem = document.createElement("div");
      newItem.className = "shopping-list";
      newItem.innerHTML = `
        <div class="shopping-list-img">
          <img src="./img/${item.checked ? "check_square_on.png" : "check_square_off.png"}" alt="체크">
        </div>
        <div class="${item.checked ? "shopping-list-complete" : "shopping-list-txt"}">${item.name}</div>
        <div class="shopping-list-buy">구매</div>
        <div class="shopping-list-del">삭제</div>
      `;
      if (item.checked) shoppingLists.append(newItem);
      else shoppingLists.prepend(newItem);
    });
    checkNoData();
  }

  // ✅ 장보기 목록 유무 확인
  function checkNoData() {
    const hasItems = shoppingLists.children.length > 0;
    shoppingArea.style.display = hasItems ? "flex" : "none";
    shoppingAreaNoData.style.display = hasItems ? "none" : "flex";
  }

  // ✅ 장보기 항목 추가
  function addItemToShoppingList(itemName) {
    if (!itemName.trim()) return;

    const allItems = shoppingLists.querySelectorAll(".shopping-list-txt, .shopping-list-complete");
    const duplicate = Array.from(allItems).some(el => el.textContent.trim() === itemName);

    if (duplicate) {
      showToast("이미 추가된 상품이에요!");
      return;
    }

    const newItem = document.createElement("div");
    newItem.className = "shopping-list";
    newItem.innerHTML = `
      <div class="shopping-list-img">
        <img src="./img/check_square_off.png" alt="체크">
      </div>
      <div class="shopping-list-txt">${itemName}</div>
      <div class="shopping-list-buy">구매</div>
      <div class="shopping-list-del">삭제</div>
    `;
    shoppingLists.prepend(newItem);
    checkNoData();
    saveShoppingListToCookie();
  }

  // ✅ 다이얼로그 열기
  function openDialog(type, targetItem = null) {
    dialog.style.display = "flex";
    if (type === "single") {
      const itemName = targetItem.querySelector(".shopping-list-txt, .shopping-list-complete").textContent.trim();
      dialogTitle.textContent = "상품삭제";
      dialogDesc.textContent = `"${itemName}"을(를) 삭제하시겠습니까?`;
      deleteBtn.onclick = () => {
        targetItem.remove();
        dialog.style.display = "none";
        checkNoData();
        saveShoppingListToCookie();
        showToast("상품이 삭제되었습니다.");
      };
    } else if (type === "all") {
      dialogTitle.textContent = "상품삭제";
      dialogDesc.textContent = "등록된 모든 상품을 삭제하시겠습니까?";
      deleteBtn.onclick = () => {
        shoppingLists.innerHTML = "";
        dialog.style.display = "none";
        checkNoData();
        saveShoppingListToCookie();
        showToast("전체 상품이 삭제되었습니다.");
      };
    }
  }

  // ✅ 다이얼로그 취소
  cancelBtn.addEventListener("click", () => {
    dialog.style.display = "none";
  });

  dialog.addEventListener("click", e => {
    if (e.target === dialog) dialog.style.display = "none";
  });

  // ✅ 아이템칩 클릭
  itemChips.forEach(chip => {
    chip.addEventListener("click", () => addItemToShoppingList(chip.textContent.trim()));
  });

  // ✅ 입력한 내용 추가 버튼
  addBtn.addEventListener("click", () => {
    const value = input.value.trim();
    if (value) {
      addItemToShoppingList(value);
      input.value = "";
    }
  });

  // ✅ 리스트 클릭 이벤트
  shoppingLists.addEventListener("click", e => {
    const target = e.target;
    const listItem = target.closest(".shopping-list");
    if (!listItem) return;

    // 체크박스 및 텍스트 클릭
    if (target.closest(".shopping-list-img") || target.classList.contains("shopping-list-txt") || target.classList.contains("shopping-list-complete")) {
      const img = listItem.querySelector(".shopping-list-img img");
      const textDiv = listItem.querySelector(".shopping-list-txt, .shopping-list-complete");
      const isChecked = img.src.includes("check_square_on.png");

      if (isChecked) {
        img.src = "./img/check_square_off.png";
        textDiv.className = "shopping-list-txt";
        shoppingLists.prepend(listItem);
      } else {
        img.src = "./img/check_square_on.png";
        textDiv.className = "shopping-list-complete";
        shoppingLists.append(listItem);
      }
      saveShoppingListToCookie();
    }

    // [구매] 버튼 클릭
    if (target.classList.contains("shopping-list-buy")) {
      const itemName = listItem.querySelector(".shopping-list-txt, .shopping-list-complete").textContent.trim();
      const url = `https://www.coupang.com/np/search?component=&q=${encodeURIComponent(itemName)}`;
      window.open(url, "_blank");
    }

    // 개별 삭제 버튼 클릭
    if (target.classList.contains("shopping-list-del")) {
      openDialog("single", listItem);
    }
  });

  // ✅ 모두삭제 클릭
  const deleteAllBtn = document.querySelector(".shopping-content-caption");
  deleteAllBtn.addEventListener("click", () => {
    if (shoppingLists.children.length > 0) openDialog("all");
    else showToast("삭제할 상품이 없어요!");
  });

  // ✅ 페이지 로드시 쿠키 복원
  loadShoppingListFromCookie();

  // ✅ 초기 상태 확인
  checkNoData();
});

// -------------------- 마이페이지 // 프로필 이동처리 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const profileEditBtn = document.querySelector(".profile-edit");
  if (profileEditBtn) {
    profileEditBtn.addEventListener("click", () => {
      window.location.href = "profile.html";
    });
  }
});

// -------------------- 정렬 셀렉트박스 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const recipeSelect = document.querySelector(".recipe-sort-select");
  const selected = recipeSelect.querySelector(".selected");
  const options = recipeSelect.querySelector(".recipe-sort-options");
  const optionItems = options.querySelectorAll("li");

  // 셀렉트 클릭 (열기/닫기)
  selected.addEventListener("click", (e) => {
    e.stopPropagation();
    selected.textContent = e.target.textContent;
    const isOpen = recipeSelect.classList.toggle("open");
    options.style.display = isOpen ? "block" : "none";
  });

  // 옵션 클릭 시 선택 및 닫기
  optionItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation(); // 부모 이벤트 차단
      selected.textContent = e.target.dataset.value;
      recipeSelect.classList.remove("open");
      options.style.display = "none";
    });
  });

  // 외부 클릭 시 닫기
  document.addEventListener("click", () => {
    recipeSelect.classList.remove("open");
    options.style.display = "none";
  });
});

// -------------------- 팔로워 / 팔로잉 클릭 시 이동 --------------------
document.getElementById("follower-tab").addEventListener("click", () => {
  window.location.href = "follow.html?tab=follower";
});
document.getElementById("following-tab").addEventListener("click", () => {
  window.location.href = "follow.html?tab=following";
});