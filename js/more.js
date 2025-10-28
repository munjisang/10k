// -------------------- 검색창 검색 기능 --------------------
let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
function addSearch(keyword) {
  if (!keyword) return;

  recentSearches = recentSearches.filter(item => item !== keyword);
  recentSearches.unshift(keyword);
  if (recentSearches.length > 10) recentSearches.pop();

  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  renderHistory();

  window.location.href = `https://m.10000recipe.com/recipe/list.html?q=${encodeURIComponent(keyword)}`;
}

// -------------------- 최근 검색어 추가 --------------------
function renderHistory() {
  const historyChips = document.querySelector(".horizon-chips");
  const historyNodata = document.querySelector(".horizon-nodata");
  const historyCaption = document.querySelector(".search-content-caption");

  historyChips.innerHTML = "";

  if (recentSearches.length === 0) {
    historyNodata.style.display = "block";
    historyCaption.style.display = "none";
  } else {
    historyNodata.style.display = "none";
    historyCaption.style.display = "block";

    recentSearches.forEach((keyword, index) => {
      const chip = document.createElement("div");
      chip.className = "horizon-chip";
      chip.innerHTML = `<span>${keyword}</span><img src="./img/clear.png" alt="삭제" data-index="${index}">`;
      historyChips.appendChild(chip);
    });
  }
}

// -------------------- 검색창 입력 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search-bar input");
  const searchIcon = document.querySelector(".search-bar .search-icon");
  const historyChips = document.querySelector(".horizon-chips");
  const historyCaption = document.querySelector(".search-content-caption");
  const recommendChips = document.querySelector(".recommend-chips");

  renderHistory();

  searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      addSearch(searchInput.value.trim());
      searchInput.value = "";
    }
  });

  searchIcon.addEventListener("click", () => {
    addSearch(searchInput.value.trim());
    searchInput.value = "";
  });

  historyChips.addEventListener("click", e => {
    if (e.target.tagName === "SPAN") {
      addSearch(e.target.textContent);
    } else if (e.target.tagName === "IMG" && e.target.alt === "삭제") {
      const index = parseInt(e.target.dataset.index);
      recentSearches.splice(index, 1);
      localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
      renderHistory();
    }
  });

  historyCaption.addEventListener("click", () => {
    recentSearches = [];
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    renderHistory();
  });

  if (recommendChips) {
    recommendChips.addEventListener("click", e => {
      if (e.target.classList.contains("recommend-chip")) {
        const keyword = e.target.textContent.trim();
        addSearch(keyword);
      }
    });
  }
});

// -------------------- 인기 검색어 목록 구성 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const popularLeft = document.querySelector(".popular-left");
  const popularRight = document.querySelector(".popular-right");

  const popularKeywords = [
    { rank: 1, keyword: "김치찜", trend: "up" },
    { rank: 2, keyword: "잔치국수", trend: "same" },
    { rank: 3, keyword: "깍뚜기", trend: "same" },
    { rank: 4, keyword: "소불고기", trend: "up" },
    { rank: 5, keyword: "오징어볶음", trend: "down" },
    { rank: 6, keyword: "무생채", trend: "same" },
    { rank: 7, keyword: "된장찌개", trend: "same" },
    { rank: 8, keyword: "오이무침", trend: "down" },
    { rank: 9, keyword: "두부조림", trend: "down" },
    { rank: 10, keyword: "김밥", trend: "up" },
  ];

  function renderPopular() {
    popularLeft.innerHTML = "";
    popularRight.innerHTML = "";

    popularKeywords.forEach((item, i) => {
      const div = document.createElement("div");
      div.className = "popular-item";

      const trendSymbol =
        item.trend === "up" ? "▲" :
        item.trend === "down" ? "▼" : "-";
      const trendClass =
        item.trend === "up" ? "trend-up" :
        item.trend === "down" ? "trend-down" : "trend-same";

      div.innerHTML = `
        <div class="popular-rank">${item.rank}</div>
        <div class="popular-trend ${trendClass}">${trendSymbol}</div>
        <div class="popular-keyword">${item.keyword}</div>
      `;

      // ✅ 인기 검색어 클릭 시도 addSearch 호출
      div.addEventListener("click", () => {
        addSearch(item.keyword);
      });

      if (i < 5) {
        popularLeft.appendChild(div);
      } else {
        popularRight.appendChild(div);
      }
    });
  }

  renderPopular();
});

// -------------------- 인기 검색어 어제 날짜 가져오기 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const dateEl = document.querySelector(".search-content-date");
  if (dateEl) {
    const now = new Date();
    now.setDate(now.getDate() - 1); // ✅ 어제 날짜로 설정

    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    dateEl.textContent = `${month}.${day} 기준`;
  }
});

// -------------------- 카메라 & 프로필 오버레이 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const cameraIcon = document.querySelector('.search-trailing-icon img'); 
  const searchOverlay = document.getElementById('searchOverlay');
  const searchSheet = searchOverlay?.querySelector('.bottom-sheet');
  const searchClose = searchOverlay?.querySelector('.sheet-area-icon');

  // -------------------- 검색 오버레이 --------------------
  if (cameraIcon && searchOverlay && searchSheet && searchClose) {
    cameraIcon.addEventListener('click', () => {
      searchOverlay.classList.add('show');
      searchSheet.classList.add('show');
      document.body.style.overflow = 'hidden'; 
    });

    searchClose.addEventListener('click', () => {
      searchSheet.classList.remove('show');
      searchOverlay.classList.remove('show');
      document.body.style.overflow = ''; 
    });

    searchOverlay.addEventListener('click', e => {
      if (e.target === searchOverlay) {
        searchSheet.classList.remove('show');
        searchOverlay.classList.remove('show');
        document.body.style.overflow = '';
      }
    });
  }

  // -------------------- 프로필 오버레이 --------------------
  const profileOverlay = document.getElementById('profileoverlay');
  const profileSheet = profileOverlay?.querySelector('.bottom-sheet');
  const profileClose = profileOverlay?.querySelector('.sheet-area-icon');
  const profileTrigger = document.querySelector('.profile-thumb, .edit-icon'); 
  const profileImg = document.querySelector('.profile-thumb img:first-child');

  if (profileOverlay && profileSheet && profileClose && profileTrigger && profileImg) {

    // 저장된 이미지 불러오기
    const savedProfileImg = localStorage.getItem('profileImage');
    if (savedProfileImg) profileImg.src = savedProfileImg;

    profileTrigger.addEventListener('click', () => {
      profileOverlay.classList.add('show');
      profileSheet.classList.add('show');
      document.body.style.overflow = 'hidden';
    });

    profileClose.addEventListener('click', closeProfileOverlay);
    profileOverlay.addEventListener('click', e => { if (e.target === profileOverlay) closeProfileOverlay(); });

    // 기본 프로필 변경
    const defaultProfileBtn = profileOverlay.querySelector('.sheet-btn:nth-child(1)');
    if (defaultProfileBtn) {
      defaultProfileBtn.addEventListener('click', () => {
        const defaultSrc = './img/profile_default.png';
        profileImg.src = defaultSrc;
        localStorage.setItem('profileImage', defaultSrc);
        closeProfileOverlay();
      });
    }

    // ✅ 이미지 리사이즈 + 저장 함수
    function resizeAndSaveImage(file, maxWidth = 1024) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let scale = 1;
            if (img.width > maxWidth) scale = maxWidth / img.width;
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8); // JPEG 80% 압축
            resolve(dataUrl);
          };
          img.onerror = reject;
          img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    // 앨범에서 선택
    const galleryInput = document.getElementById('galleryInput');
    if (galleryInput) {
      galleryInput.addEventListener('change', async e => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          const imgData = await resizeAndSaveImage(file);
          profileImg.src = imgData;
          localStorage.setItem('profileImage', imgData);
          closeProfileOverlay();
        } catch (err) {
          alert("이미지 처리 중 오류가 발생했습니다.");
          console.error(err);
        }
        e.target.value = "";
      });
    }

    // 카메라 촬영
    const cameraInput = document.getElementById('cameraInput');
    if (cameraInput) {
      cameraInput.addEventListener('change', async e => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          const imgData = await resizeAndSaveImage(file);
          profileImg.src = imgData;
          localStorage.setItem('profileImage', imgData);
          closeProfileOverlay();
        } catch (err) {
          alert("이미지 처리 중 오류가 발생했습니다.");
          console.error(err);
        }
        e.target.value = "";
      });
    }

    function closeProfileOverlay() {
      profileSheet.classList.remove('show');
      profileOverlay.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  });


// -------------------- 레시피 더보기 (무한 스크롤) --------------------
document.addEventListener("DOMContentLoaded", () => {
  const listContainer = document.querySelector(".list-items");
  const itemsPerPage = 300; // 한 번에 로드할 개수
  let currentPage = 0;
  let recipes = [];

  function renderItems() {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = recipes.slice(start, end);

    pageItems.forEach(recipe => {
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
        window.open(`https://m.10000recipe.com/recipe/${recipe.cok_sq_board}`, "_blank")
      );
      listContainer.appendChild(item);
    });

    currentPage++;
  }

  function handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      if (currentPage * itemsPerPage < recipes.length) {
        renderItems();
      }
    }
  }

  fetch("./data/recipe.json")
    .then(res => res.json())
    .then(data => {
      recipes = data.recipes.slice(0, 45);
      renderItems();
      window.addEventListener("scroll", handleScroll);
    })
    .catch(err => console.error("레시피 데이터 로드 실패:", err));
});

// -------------------- header 이전버튼 이동 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const backBtns = document.querySelectorAll(".leding-icons, .search-leding-icon");
  
  backBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (document.referrer) {
        window.history.back();
      } else {
        window.location.href = "index.html";
      }
    });
  });
});

// -------------------- 닫기 버튼 클릭 시 이전 페이지로 이동 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.querySelector(".closed-icon");
  closeBtn.addEventListener("click", () => {
    history.back() = "setting.html"; 
  });
});

// -------------------- 검색페이지 이동 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const folderEditBtn = document.querySelector(".cate-header-icons");
  if (folderEditBtn) {
    folderEditBtn.addEventListener("click", () => {
      window.location.href = "search.html";
    });
  }
});

// -------------------- 닫기버튼 이동 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const folderEditBtn = document.querySelector(".page-close");
  if (folderEditBtn) folderEditBtn.addEventListener("click", () => window.location.href = "scrap.html");
});

// -------------------- folder_삭제 다이얼로그 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const delButtons = document.querySelectorAll(".folder-option-del");
  const dialog = document.querySelector(".dialog-overlay");
  const dialogDesc = document.querySelector(".dialog-desc");
  const cancelBtn = document.querySelector(".dialog-cancel");
  const deleteBtn = document.querySelector(".dialog-delete");
  const toast = document.getElementById("toast");

  delButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const folderName = btn.closest(".folder-editlist-option")?.querySelector(".folder-editlist-option-txt")?.textContent || "이 폴더";
      dialogDesc.innerHTML = `<b>${folderName}</b>을 삭제할까요?<br>폴더를 삭제하면 폴더에 담긴 레시피도 함께 삭제 됩니다.`;
      dialog.style.display = "flex";
    });
  });

  cancelBtn.addEventListener("click", () => dialog.style.display = "none");
  deleteBtn.addEventListener("click", () => {
    dialog.style.display = "none";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  });

  dialog.addEventListener("click", e => { if (e.target === dialog) dialog.style.display = "none"; });
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
    const toast = document.getElementById("toast");
    if (toast) {
      toast.classList.remove("show");
      void toast.offsetWidth;
      toast.textContent = `"${folderName}" 폴더가 추가되었습니다.`;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2500);
    }
  });

  bottomSheetOverlay.addEventListener("click", e => { if (e.target === bottomSheetOverlay) closeSheet(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && bottomSheetOverlay.style.display === "flex") closeSheet(); });
  if (folderAdd) folderAdd.addEventListener("click", openSheet);
  if (pageAdd) pageAdd.addEventListener("click", openSheet);
});

// -------------------- 폴더 수정 & 삭제 통합 처리 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const editOverlay = document.querySelector(".folder-edit-overlay");
  const editSheet = document.querySelector(".folder-edit");
  const editInput = document.querySelector(".folder-edit-input");
  const cancelBtn = document.querySelector(".folder-edit-cancel");
  const saveBtn = document.querySelector(".folder-edit-save");

  const dialogOverlay = document.querySelector(".dialog-overlay");
  const deleteBtn = document.querySelector(".dialog-delete");

  // -------------------- 폴더 수정 바텀시트 --------------------
  const openEditSheet = (folderNameElem) => {
    const folderName = folderNameElem.textContent.trim();
    editOverlay.style.display = "flex";
    editInput.value = folderName;
    updateSaveButtonState();
    setTimeout(() => editSheet.classList.add("show"), 10);
    editInput.focus();
  };

  const closeEditSheet = () => {
    editSheet.classList.remove("show");
    setTimeout(() => (editOverlay.style.display = "none"), 300);
  };

  const updateSaveButtonState = () => {
    const hasText = editInput.value.trim().length > 0;
    saveBtn.disabled = !hasText;
    saveBtn.classList.toggle("active", hasText);
  };

  editInput.addEventListener("input", updateSaveButtonState);
  cancelBtn.addEventListener("click", closeEditSheet);

  saveBtn.addEventListener("click", () => {
    if (saveBtn.disabled) return;
    closeEditSheet();
    showToast("폴더명이 수정되었습니다.");
  });

  editOverlay.addEventListener("click", e => { 
    if (e.target === editOverlay) closeEditSheet(); 
  });

  document.querySelectorAll(".folder-option-edit").forEach(btn => {
    btn.addEventListener("click", () => {
      const folderNameElem = btn.closest(".folder-editlist-option")
        .querySelector(".folder-editlist-option-txt");
      openEditSheet(folderNameElem);
    });
  });

  // -------------------- 폴더 삭제 다이얼로그 --------------------
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      dialogOverlay.style.display = "none";
      showToast("폴더가 삭제되었습니다.");
    });
  }
});

// -------------------- 토스트 기본 엘리먼트 생성 --------------------
let toast = document.getElementById("toast");
if (!toast) {
  toast = document.createElement("div");
  toast.id = "toast";
  document.body.appendChild(toast);
}

// -------------------- 공용 토스트 함수 --------------------
let toastTimer = null;

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  // 기존 타이머 제거
  if (toastTimer) clearTimeout(toastTimer);

  // 새 메시지 표시
  toast.textContent = message;
  toast.classList.add("show");

  // 2.5초 뒤 숨김
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// -------------------- 안드로이드 뒤로가기 오버레이 제어 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const overlays = [
    document.querySelector(".folder-add-overlay"),
    document.querySelector(".folder-edit-overlay"),
    document.querySelector(".dialog-overlay"),
    document.querySelector(".folder-select-overlay"),
    document.querySelector(".recipe-dialog-overlay"),
  ].filter(Boolean);

  let overlayActive = false; // ✅ 현재 overlay 히스토리 등록 여부

  // -------------------- 공통 닫기 이벤트 --------------------
  overlays.forEach(overlay => {
    overlay.addEventListener("closeOverlay", () => {
      const sheet = overlay.querySelector(".folder-add, .folder-edit, .folder-select, .recipe-dialog-box");
      if (sheet) sheet.classList.remove("show");
      overlay.style.display = "none";

      // 모든 오버레이 닫혔으면 히스토리 상태 해제
      const anyVisible = overlays.some(o => o.style.display === "flex" || o.style.display === "block");
      if (!anyVisible) overlayActive = false;
    });
  });

  // -------------------- 오버레이 열릴 때 pushState 1회만 --------------------
  const showOverlay = (overlay) => {
    if (!overlayActive) {
      history.pushState({ overlay: true }, "");
      overlayActive = true;
    }
    overlay.style.display = "flex";
  };

  // 이 함수로 열면 됨 → 기존 코드에 `overlay.style.display = "flex";` 부분을 이걸로 대체
  window.showOverlay = showOverlay;

  // -------------------- 뒤로가기 (popstate) --------------------
  window.addEventListener("popstate", (e) => {
    const openOverlays = overlays.filter(o => o.style.display === "flex" || o.style.display === "block");

    if (openOverlays.length > 0) {
      e.preventDefault?.();

      // 맨 위 오버레이 닫기
      const topOverlay = openOverlays[openOverlays.length - 1];
      topOverlay.dispatchEvent(new Event("closeOverlay"));

      // 모든 오버레이 닫혔으면 overlayActive 해제
      const anyVisible = overlays.some(o => o.style.display === "flex" || o.style.display === "block");
      if (!anyVisible) overlayActive = false;
    } else {
      // 오버레이 없으면 원래 브라우저 뒤로가기 동작
      overlayActive = false;
      history.back();
    }
  });
});

// -------------------- 레시피 선택, 폴더 활성화 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const scrapArea = document.querySelector(".scrap-area") || document.querySelector(".scrap-edit-area");
  const listItems = scrapArea?.querySelector(".list-items") || null;
  const nodata = document.querySelector(".scrap-area-nodata") || document.querySelector(".scrap-edit-area-nodata");
  let recipeList = [];

  function shuffleArray(array, count) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, count);
  }

  function resetRecipeSelection() {
    const selectedItems = document.querySelectorAll(".list-item.selected");
    selectedItems.forEach(item => {
      item.classList.remove("selected");
      const overlay = item.querySelector(".overlay");
      const checkbox = item.querySelector(".checkbox");
      if (overlay) overlay.style.backgroundColor = "var(--DIM-WHITE)";
      if (checkbox) checkbox.src = "./img/check_default.png";
    });
    updateEditMenuState(0);
  }

  fetch('./data/recipe.json')
    .then(res => res.json())
    .then(data => {
      recipeList = data.recipes || [];
      initFolderList(".folder-list");
      initFolderList(".scrap-edit-folder");
      const initial = document.querySelector(".folder-active") || document.querySelector(".folder-list > div") || document.querySelector(".scrap-edit-folder > div");
      if (initial) initial.click();
    })
    .catch(err => console.error("레시피 로드 실패:", err));

  function initFolderList(selector) {
    const folderList = document.querySelector(selector);
    if (!folderList) return;
    const folders = folderList.querySelectorAll(":scope > div");
    if (!folders.length) return;

    folders.forEach(folder => {
      if (folder._hasFolderClick) return;
      folder._hasFolderClick = true;

      folder.addEventListener("click", () => {
        if (!recipeList.length || !scrapArea || !listItems) return;

        resetRecipeSelection();
        listItems.innerHTML = "";

        folders.forEach(f => {
          f.classList.remove("folder-active");
          f.classList.add("folder-nonactive");
          const name = f.querySelector("span");
          const countDiv = f.querySelector("div");
          if (name) name.className = "folder-nonactive-name";
          if (countDiv) countDiv.className = "folder-nonactive-count";
        });

        folder.classList.remove("folder-nonactive");
        folder.classList.add("folder-active");
        const name = folder.querySelector("span");
        const countDiv = folder.querySelector("div");
        if (name) name.className = "folder-active-name";
        if (countDiv) countDiv.className = "folder-active-count";

        let count = 0;
        if (countDiv?.textContent) {
          const match = countDiv.textContent.match(/\d+/);
          count = match ? parseInt(match[0], 10) : 0;
        }

        listItems.setAttribute("data-count", count);
        scrapArea.style.display = count === 0 ? "none" : "flex";
        if (nodata) nodata.style.display = count === 0 ? "flex" : "none";

        const selectedRecipes = shuffleArray(recipeList, count);
        selectedRecipes.forEach(recipe => {
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
            <div class="overlay">
              <img src="./img/check_default.png" class="checkbox">
            </div>
          `;
          const overlay = item.querySelector(".overlay");
          const checkbox = item.querySelector(".checkbox");

          item.addEventListener("click", e => {
            e.stopPropagation();
            const isSelected = item.classList.toggle("selected");
            overlay.style.backgroundColor = isSelected ? 'var(--DIM-TERTIARY)' : 'var(--DIM-WHITE)';
            checkbox.src = isSelected ? './img/check_active.png' : './img/check_default.png';
            const selectedCount = document.querySelectorAll('.list-item.selected').length;
            updateEditMenuState(selectedCount);
          });

          listItems.appendChild(item);
        });

        const folderRect = folder.getBoundingClientRect();
        const listRect = folderList.getBoundingClientRect();
        const center = listRect.width / 4 - folderRect.width / 2;
        const targetScroll = folderRect.left + folderList.scrollLeft - listRect.left - center;
        folderList.scrollTo({ left: targetScroll, behavior: "smooth" });

        const headerHeight = document.querySelector(".sub-header")?.offsetHeight || 0;
        const folderHeight = folderList.offsetHeight || 0;
        const scrapAreaTop = scrapArea.getBoundingClientRect().top + window.scrollY;
        const scrollToPos = scrapAreaTop - headerHeight - folderHeight;
        window.scrollTo({ top: scrollToPos, behavior: "smooth" });
      });
    });
  }

  window.resetRecipeSelection = resetRecipeSelection;
});

// -------------------- 편집모드 바텀 메뉴 활성화 --------------------
function updateEditMenuState(selectedCount) {
  const copyItem = document.querySelector('.edit-bottom-menu .edit-menu-item:nth-child(1) .edit-menu-icon');
  const moveItem = document.querySelector('.edit-bottom-menu .edit-menu-item:nth-child(3) .edit-menu-icon');
  const delItem  = document.querySelector('.edit-bottom-menu .edit-menu-item:nth-child(5) .edit-menu-icon');

  const copyLabel = document.querySelector('.edit-bottom-menu .edit-menu-item:nth-child(1) .edit-menu-label');
  const moveLabel = document.querySelector('.edit-bottom-menu .edit-menu-item:nth-child(3) .edit-menu-label');
  const delLabel  = document.querySelector('.edit-bottom-menu .edit-menu-item:nth-child(5) .edit-menu-label');

  if (selectedCount > 0) {
    copyItem.src = './img/edit_copy_on.png';
    moveItem.src = './img/edit_move_on.png';
    delItem.src  = './img/edit_del_on.png';
    copyLabel.classList.add('edit-menu-labelactive');
    moveLabel.classList.add('edit-menu-labelactive');
    delLabel.classList.add('edit-menu-labelactive');
  } else {
    copyItem.src = './img/edit_copy_off.png';
    moveItem.src = './img/edit_move_off.png';
    delItem.src  = './img/edit_del_off.png';
    copyLabel.classList.remove('edit-menu-labelactive');
    moveLabel.classList.remove('edit-menu-labelactive');
    delLabel.classList.remove('edit-menu-labelactive');
  }
}

// -------------------- 레시피 삭제 & 폴더 선택 바텀시트 --------------------
document.addEventListener("DOMContentLoaded", () => {

  const toast = document.getElementById("toast");

  function showToast(msg){
    if(!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(()=>toast.classList.remove("show"), 2500);
  }

  /* -------------------- 레시피 삭제 다이얼로그 -------------------- */
  const deleteMenu = document.querySelector('.edit-bottom-menu .edit-menu-item:nth-child(5)');
  const dialogOverlay = document.querySelector('.recipe-dialog-overlay');
  const dialogDesc = document.querySelector('.recipe-dialog-desc');
  const cancelBtn = document.querySelector('.recipe-dialog-cancel');
  const deleteBtn = document.querySelector('.recipe-dialog-delete');

  deleteMenu?.addEventListener("click", () => {
    const selectedCount = document.querySelectorAll(".list-item.selected").length;
    if(selectedCount === 0) return; // 메시지 제거

    // folderOverlay가 열려 있으면 닫기
    if (folderOverlay?.style.display === "flex") {
      folderSheet.classList.remove("show");
      folderOverlay.style.display = "none";
    }

    dialogDesc.textContent = `${selectedCount}개의 레시피를 삭제하시겠습니까?`;
    dialogOverlay.style.display = "flex";
  });

  cancelBtn?.addEventListener("click", ()=> dialogOverlay.style.display="none");
  deleteBtn?.addEventListener("click", ()=>{
    dialogOverlay.style.display="none";
    showToast("레시피가 삭제 되었습니다.");
    document.querySelectorAll(".list-item.selected").forEach(item=>{
      item.classList.remove("selected");
      const checkbox = item.querySelector(".checkbox");
      if(checkbox) checkbox.src = "./img/check_default.png";
      const overlay = item.querySelector(".overlay");
      if(overlay) overlay.style.backgroundColor = "var(--DIM-WHITE)";
    });
    updateEditMenuState(0);
  });

  dialogOverlay?.addEventListener("click", e => { if(e.target===dialogOverlay) dialogOverlay.style.display="none"; });
  document.addEventListener("keydown", e => { if(e.key==="Escape" && dialogOverlay.style.display==="flex") dialogOverlay.style.display="none"; });

  /* -------------------- 폴더 선택 바텀시트 -------------------- */
  const folderOverlay = document.querySelector(".folder-select-overlay");
  const folderSheet = folderOverlay?.querySelector(".folder-select");
  const cancelFolder = folderOverlay?.querySelector(".folder-select-cancel");
  const confirmFolder = folderOverlay?.querySelector(".folder-select-confirm");
  const folderLists = folderOverlay?.querySelectorAll(".folder-select-list");

  let currentMode = null;

  function openFolderSheet(mode){
    currentMode = mode;
    if(!folderOverlay || !folderSheet) return;
    folderOverlay.style.display = "flex";
    setTimeout(()=>folderSheet.classList.add("show"), 10);
  }

  function closeFolderSheet(){
    if(!folderOverlay || !folderSheet) return;
    folderSheet.classList.remove("show");
    setTimeout(()=>folderOverlay.style.display="none", 300);
  }

  function resetFolderSelection(){
    folderLists?.forEach(list=>{
      list.classList.remove("selected");
      const check = list.querySelector(".folder-check-img img");
      const txt = list.querySelector(".folder-select-list-txt");
      if(check) check.src="./img/check_off.png";
      if(txt) txt.style.color="var(--BLACK-MAIN)";
    });
    confirmFolder?.classList.remove("active");
  }

  function resetRecipeSelection(){
    document.querySelectorAll(".list-item.selected").forEach(item=>{
      item.classList.remove("selected");
      const overlay = item.querySelector(".overlay");
      const checkbox = item.querySelector(".checkbox");
      if(overlay) overlay.style.backgroundColor="var(--DIM-WHITE)";
      if(checkbox) checkbox.src="./img/check_default.png";
    });
    updateEditMenuState(0);
  }

  const copyItem = document.querySelector('.edit-bottom-menu .edit-menu-item:nth-child(1)');
  const moveItem = document.querySelector('.edit-bottom-menu .edit-menu-item:nth-child(3)');

  copyItem?.addEventListener("click", ()=>{ if(copyItem.querySelector(".edit-menu-icon").src.includes("_on.png")) openFolderSheet("copy"); });
  moveItem?.addEventListener("click", ()=>{ if(moveItem.querySelector(".edit-menu-icon").src.includes("_on.png")) openFolderSheet("move"); });

  folderLists?.forEach(list=>{
    list.addEventListener("click", ()=>{
      const isSelected = list.classList.toggle("selected");
      const check = list.querySelector(".folder-check-img img");
      const txt = list.querySelector(".folder-select-list-txt");
      if(check) check.src=isSelected?"./img/check_on.png":"./img/check_off.png";
      if(txt) txt.style.color=isSelected?"var(--TERTIARY-08)":"var(--BLACK-MAIN)";
      confirmFolder?.classList.toggle("active", document.querySelectorAll(".folder-select-list.selected").length>0);
    });
  });

  cancelFolder?.addEventListener("click", ()=>{ closeFolderSheet(); resetFolderSelection(); resetRecipeSelection(); });
  confirmFolder?.addEventListener("click", ()=>{
    if(!confirmFolder.classList.contains("active")) return;
    showToast(currentMode==="copy"?"레시피가 선택하신 폴더로 복사되었습니다.":"레시피가 선택하신 폴더로 이동되었습니다.");
    closeFolderSheet(); resetFolderSelection(); resetRecipeSelection();
  });

  folderOverlay?.addEventListener("click", e => { if(e.target===folderOverlay) { closeFolderSheet(); resetFolderSelection(); resetRecipeSelection(); } });
  document.addEventListener("keydown", e => { if(e.key==="Escape" && folderOverlay?.style.display==="flex") { closeFolderSheet(); resetFolderSelection(); resetRecipeSelection(); } });

});

// -------------------- 정렬 셀렉트박스 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const recipeSelect = document.querySelector(".cate-recipe-custom-select");
  const selected = recipeSelect.querySelector(".selected");
  const options = recipeSelect.querySelector(".cate-recipe-options");
  const optionItems = options.querySelectorAll("li");

  // 셀렉트 클릭 (열기/닫기)
  selected.addEventListener("click", (e) => {
    e.stopPropagation();
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

// -------------------- 헤더 카테고리 선택 셀렉트박스 연동 --------------------
document.addEventListener("DOMContentLoaded", async () => {
  const selectWrapper = document.querySelector(".cate-select-wrapper");
  const subCateItemsContainer = document.querySelector(".sub-cate-items");
  const listContainer = document.querySelector(".list-items");

  if (!selectWrapper) {
    console.warn("cate-select-wrapper가 없습니다. cate-custom-select 동작 불가.");
  }

  const customSelect = selectWrapper ? selectWrapper.querySelector(".cate-custom-select") : null;
  const selected = customSelect ? customSelect.querySelector(".selected") : null;
  const optionsContainer = customSelect ? customSelect.querySelector(".cate-options") : null;
  const chevron = customSelect ? customSelect.querySelector(".cate-chevron-icon") : null;

  let categories = [];
  let recipes = [];
  let currentPage = 0;
  const itemsPerPage = 300;

  const urlParams = new URLSearchParams(window.location.search);
  const selectedCategoryNameFromURL = urlParams.get("category");
  const selectedSubNameFromURL = urlParams.get("sub");

  function openSelect() {
    if (!customSelect || !optionsContainer) return;
    customSelect.classList.add("open");
    optionsContainer.style.display = "block";
  }
  function closeSelect() {
    if (!customSelect || !optionsContainer) return;
    customSelect.classList.remove("open");
    optionsContainer.style.display = "none";
  }
  function toggleSelect() {
    if (!customSelect || !optionsContainer) return;
    const isOpen = customSelect.classList.toggle("open");
    optionsContainer.style.display = isOpen ? "block" : "none";
  }

  function renderItems(reset = false) {
    if (!listContainer) return;
    if (reset) {
      listContainer.innerHTML = "";
      currentPage = 0;
    }

    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = recipes.slice(start, end);

    pageItems.forEach(recipe => {
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
      item.addEventListener("click", () => {
        window.open(`https://m.10000recipe.com/recipe/${recipe.cok_sq_board}`, "_blank");
      });
      listContainer.appendChild(item);
    });

    currentPage++;
  }

  function handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      if ((currentPage) * itemsPerPage < recipes.length) {
        renderItems();
      }
    }
  }

  try {
    const res = await fetch("./data/category.json");
    categories = await res.json();
    if (!Array.isArray(categories) || categories.length === 0) {
      console.warn("category.json이 비어있거나 배열이 아님");
    } else {
      if (optionsContainer) {
        optionsContainer.innerHTML = "";
        optionsContainer.style.display = "none"; 
      }

      categories.forEach(cat => {
        if (!optionsContainer) return;
        const li = document.createElement("li");
        li.dataset.value = cat.category_name;
        li.textContent = cat.category_name;
        li.style.cursor = "pointer";

        li.addEventListener("click", (e) => {
          e.stopPropagation(); 
          if (selected) selected.textContent = li.dataset.value;
          closeSelect();

          const selectedCategory = categories.find(c => c.category_name === li.dataset.value);
          if (selectedCategory) {
            renderSubCategories(selectedCategory.sub, null); 
          }
        });

        optionsContainer.appendChild(li);
      });

      const initialCategory = categories.find(c => c.category_name === selectedCategoryNameFromURL) || categories[0];
      if (selected) selected.textContent = (initialCategory && initialCategory.category_name) || "";
      if (initialCategory) renderSubCategories(initialCategory.sub, selectedSubNameFromURL);
    }
  } catch (err) {
    console.error("❌ category.json 로드 실패:", err);
  }

  if (selected) {
    selected.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleSelect();
    });
  }

  if (chevron) {
    chevron.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleSelect();
    });
  }

  document.addEventListener("click", (e) => {
    if (customSelect && !customSelect.contains(e.target)) {
      closeSelect();
    }
  });

  // --- 서브카테고리 렌더링 ---
  function renderSubCategories(subs, activeSubName = null) {
    if (!subCateItemsContainer) return;
    subCateItemsContainer.innerHTML = "";

    subs.forEach((sub, idx) => {
      const div = document.createElement("div");
      div.className = "sub-cate-item";
      div.textContent = sub.sub_category_name;
      div.style.cursor = "pointer";

      if (activeSubName && sub.sub_category_name === activeSubName) {
        div.classList.add("active");
      } else if (!activeSubName && idx === 0) {
        div.classList.add("active");
      }

      div.addEventListener("click", async (e) => {
        e.preventDefault();

        // 활성화 처리
        subCateItemsContainer.querySelectorAll(".sub-cate-item").forEach(el => el.classList.remove("active"));
        div.classList.add("active");

        // 스크롤 중앙 이동
        const listRect = subCateItemsContainer.getBoundingClientRect();
        const itemRect = div.getBoundingClientRect();
        const offset = itemRect.left - listRect.left - (listRect.width / 4) + (itemRect.width / 2);

        subCateItemsContainer.scrollTo({
          left: subCateItemsContainer.scrollLeft + offset,
          behavior: "smooth"
        });

        // ✅ 서브카테고리 클릭 시 레시피 새로 로드 + 랜덤 섞기
        try {
          const res = await fetch("./data/recipe.json");
          const recipeData = await res.json();

          // 🔹 랜덤 섞기
          recipes = Array.isArray(recipeData.recipes)
            ? recipeData.recipes.sort(() => Math.random() - 0.5).slice(0, 45)
            : [];

          renderItems(true);
        } catch (err) {
          console.error("❌ recipe.json 다시 로드 실패:", err);
        }
      });



      subCateItemsContainer.appendChild(div);
    });

    const activeItem = subCateItemsContainer.querySelector(".sub-cate-item.active");
    if (activeItem) {
      setTimeout(() => {
        const listRect = subCateItemsContainer.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        const offset = itemRect.left - listRect.left - (listRect.width / 4) + (itemRect.width / 2);

        subCateItemsContainer.scrollBy({
          left: offset,
          behavior: "smooth"
        });
      }, 100);
    }
  }


  try {
    const resRecipe = await fetch("./data/recipe.json");
    const recipeData = await resRecipe.json();
    recipes = Array.isArray(recipeData.recipes) ? recipeData.recipes.slice(0, 45) : [];
    renderItems();
    window.addEventListener("scroll", handleScroll);
  } catch (err) {
    console.error("❌ recipe.json 로드 실패:", err);
  }
});

// -------------------- 필터 오버레이 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const filterOverlay = document.getElementById("filterOverlay");
  const filterSheet = filterOverlay.querySelector(".filter-sheet");
  const filterBtnImg = document.querySelector(".cate-recipe-option-img img");
  const filterBtnWrapper = document.querySelector(".cate-recipe-option-img");
  const filterClose = filterOverlay.querySelector(".filter-title-area-icon");
  const cancelBtn = filterOverlay.querySelector(".filter-select-cancel");
  const confirmBtn = filterOverlay.querySelector(".filter-select-confirm");
  const allChips = filterOverlay.querySelectorAll(".filter-select");

  // 오버레이 열기
  filterBtnWrapper.addEventListener("click", () => {
    filterOverlay.style.display = "flex";
    filterSheet.classList.add("show");
  });

  // 오버레이 닫기
  const closeOverlay = () => {
    filterSheet.classList.remove("show");
    setTimeout(() => {
      filterOverlay.style.display = "none";
    }, 300);
  };

  // 닫기 버튼 클릭
  filterClose.addEventListener("click", closeOverlay);

  // ✅ 오버레이 배경 터치 시 닫기 (시트 영역 제외)
  filterOverlay.addEventListener("click", (e) => {
    if (e.target === filterOverlay) {
      // 바깥 클릭 → 닫기 (변경사항 저장 안함)
      closeOverlay();
    }
  });

  // 초기화 버튼 클릭
  cancelBtn.addEventListener("click", () => {
    allChips.forEach(chip => chip.classList.remove("active"));
    updateFilterUI();
  });

  // 레시피 보기 버튼 클릭
  confirmBtn.addEventListener("click", () => {
    closeOverlay(); // 닫기 (선택 상태 유지)
  });

  // Chip 선택 토글
  filterOverlay.addEventListener("click", (e) => {
    const chip = e.target.closest(".filter-select");
    if (!chip) return;

    chip.classList.toggle("active");
    updateFilterUI();
  });

  // 필터 UI 상태 업데이트
  function updateFilterUI() {
    const activeCount = Array.from(allChips).filter(c => c.classList.contains("active")).length;

    confirmBtn.textContent = activeCount > 0
      ? `${activeCount}개 조건 레시피 보기`
      : "모든 레시피 보기";

    confirmBtn.disabled = false; // 항상 활성화
    filterBtnImg.src = activeCount > 0 ? "./img/filter_on.png" : "./img/filter.png";
  }

  updateFilterUI();
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
  });

// -------------------- 토글 버튼 --------------------
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.toggle-switch').forEach((wrap, idx) => {
    const input = wrap.querySelector('input.myToggle');
    const label = wrap.querySelector('.toggle-label');

    if (!input || !label) return;

    if (!input.id) {
      input.id = `myToggle_${Date.now().toString(36)}_${idx}`;
    }
    label.htmlFor = input.id;

    updateToggleVisual(input);

    input.addEventListener('change', () => {
      updateToggleVisual(input);
      const name = wrap.closest('.setting-info')?.querySelector('.setting-name')?.textContent?.trim() || input.id;
    });

    label.tabIndex = 0;
    label.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        input.click();
      }
    });
  });

  function updateToggleVisual(input) {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (!label) return;
    if (input.checked) label.classList.add('on');
    else label.classList.remove('on');
  }
});

// -------------------- 토글버튼 토스트 메시지 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll('.toggle-switch input');
  const toast = document.getElementById('toast');

  function showToast(message) {
    const now = new Date();
    const formatted = now.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/\. /g, '.').replace('.', '').replace(',', '');

    toast.innerHTML = `
      ${message}<br>
      - 전송자 : (주)만개의레시피<br>
      - 수신일시 : ${formatted}
    `;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  toggles.forEach(toggle => {
    toggle.addEventListener('change', e => {
      const name = e.target.closest('.activity-info').querySelector('.activity-name').innerText;
      const state = e.target.checked ? '허용' : '거부';
      showToast(`${name}이 수신 ${state} 되었습니다`);
    });
  });
});

// -------------------- 프로필 변경 바텀시트 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const editItems = document.querySelectorAll(".edit-list");
  const STORAGE_KEY = "profileData";

  const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  editItems.forEach(item => {
    const field = item.querySelector(".edit-name").textContent.trim();
    if (savedData[field]) {
      const detail = item.querySelector(".edit-detail");
      if (detail) detail.textContent = savedData[field];
    }
  });

  const editOverlay = document.querySelector(".profile-edit-overlay");
  const editSheet = editOverlay.querySelector(".profile-edit");
  const editTitle = editSheet.querySelector(".profile-edit-title");
  const editInput = editSheet.querySelector(".profile-edit-input");
  const editTextarea = editSheet.querySelector(".profile-edit-textarea");
  const supportingText = editSheet.querySelector(".profile-edit-Supporting");
  const cancelBtn = editSheet.querySelector(".profile-edit-cancel");
  const confirmBtn = editSheet.querySelector(".profile-edit-confirm");

  let currentEditItem = null;
  let currentField = "";

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const updateConfirmButtonState = () => {
    const activeField = editInput.style.display === "block" ? editInput : editTextarea;
    const value = activeField.value.trim();
    let isValid = value.length > 0;

    if (currentField === "이메일") isValid = isValidEmail(value);

    confirmBtn.disabled = !isValid;
    confirmBtn.classList.toggle("active", isValid);
  };

  const openEditSheet = (item) => {
    currentEditItem = item;
    currentField = item.querySelector(".edit-name").textContent.trim();

    editInput.type = "text";
    supportingText.textContent = "";

    const savedValue = savedData[currentField] || item.querySelector(".edit-detail")?.textContent || "";

    switch (currentField) {
      case "닉네임":
        editTitle.textContent = "닉네임을 입력해주세요.";
        editInput.placeholder = "최대 20자까지 등록 가능합니다.";
        editInput.maxLength = 20;
        editInput.value = savedValue;
        editInput.style.display = "block";
        editTextarea.style.display = "none";
        supportingText.textContent = "ⓘ 닉네임은 최대 20자까지 등록 가능합니다.";
        break;

      case "소개":
        editTitle.textContent = "소개를 입력해주세요.";
        editTextarea.placeholder = "최대 50자까지 등록 가능합니다.";
        editTextarea.maxLength = 50;
        editTextarea.value = savedValue;
        editInput.style.display = "none";
        editTextarea.style.display = "block";
        supportingText.textContent = "ⓘ 소개내용은 최대 50자까지 등록 가능합니다.";
        break;

      case "이메일":
        editTitle.textContent = "이메일을 입력해주세요.";
        editInput.placeholder = "example@email.com";
        editInput.maxLength = 50;
        editInput.type = "email";
        editInput.value = savedValue;
        editInput.style.display = "block";
        editTextarea.style.display = "none";
        supportingText.textContent = "ⓘ 이메일 형식에 맞게 입력해주세요.";
        break;

      default:
        return;
    }

    editOverlay.style.display = "flex";
    setTimeout(() => editSheet.classList.add("show"), 10);
    (editInput.style.display === "block" ? editInput : editTextarea).focus();
    updateConfirmButtonState();
  };

  const closeEditSheet = () => {
    editSheet.classList.remove("show");
    setTimeout(() => (editOverlay.style.display = "none"), 300);
    editInput.value = "";
    editTextarea.value = "";
    currentField = "";
  };

  editItems.forEach(item => {
    item.addEventListener("click", () => {
      const field = item.querySelector(".edit-name").textContent.trim();

      // 바텀시트를 열지 않을 항목
      if (field === "차단회원 관리") {
        window.location.href = "block.html"; // 이동할 URL
        return;
      }

      // 내 SNS 링크 클릭 시 페이지 이동
      if (field === "내 SNS 링크") {
        window.location.href = "mysns.html"; // 이동할 URL
        return;
      }

      openEditSheet(item);
    });
  });

  editInput.addEventListener("input", updateConfirmButtonState);
  editTextarea.addEventListener("input", updateConfirmButtonState);
  cancelBtn.addEventListener("click", closeEditSheet);

  confirmBtn.addEventListener("click", () => {
    if (confirmBtn.disabled || !currentEditItem) return;

    const value = (editInput.style.display === "block" ? editInput : editTextarea).value.trim();
    const detail = currentEditItem.querySelector(".edit-detail");
    if (detail) detail.textContent = value;

    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    data[currentField] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    closeEditSheet();
  });

  editOverlay.addEventListener("click", e => { if (e.target === editOverlay) closeEditSheet(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && editOverlay.style.display === "flex") closeEditSheet(); });
});

// -------------------- SNS 정보 저장/불러오기 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const snsBars = document.querySelectorAll(".sns-bar");
  const saveBtn = document.querySelector(".sns-add-btn");
  const STORAGE_KEY = "mySNS";

  // -------------------- 저장된 값 불러오기 --------------------
  const loadSNSData = () => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

    snsBars.forEach((bar, index) => {
      const prefix = bar.querySelector(".sns-url span")?.textContent.trim() || "";
      const input = bar.querySelector("input");
      const fullUrl = data[index] || "";

      // prefix가 포함되어 있으면 prefix 이후 부분만 input에 표시
      if (fullUrl.startsWith(prefix)) {
        input.value = fullUrl.slice(prefix.length);
      } else {
        input.value = fullUrl; // 혹시 모를 prefix 누락 대비
      }
    });

    updateSaveButtonState();
  };

  // -------------------- 저장 버튼 상태 업데이트 --------------------
  const updateSaveButtonState = () => {
    const hasValue = Array.from(snsBars).some(bar => bar.querySelector("input").value.trim().length > 0);
    saveBtn.disabled = false; // 항상 저장 가능
    saveBtn.classList.toggle("active", hasValue);
  };

  snsBars.forEach(bar => {
    const input = bar.querySelector("input");
    input.addEventListener("input", updateSaveButtonState);
  });

  // -------------------- 저장 이벤트 --------------------
  saveBtn.addEventListener("click", () => {
    const data = {};

    snsBars.forEach((bar, index) => {
      const prefix = bar.querySelector(".sns-url span")?.textContent.trim() || "";
      const input = bar.querySelector("input");
      const value = input.value.trim();
      data[index] = value ? prefix + value : "";
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    sessionStorage.setItem("snsSaved", "true");

    const toast = document.getElementById("toast");
    if (toast) {
      toast.textContent = "SNS 정보가 저장되었습니다.";
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
        window.location.replace("profile.html");
      }, 500);
    } else {
      window.location.replace("profile.html");
    }
  });

  // 페이지 로드 시 불러오기
  loadSNSData();
});

// -------------------- mysns history back 이벤트 바인딩 --------------------
document.addEventListener("DOMContentLoaded", () => {
  // mysns.html에서 돌아온 경우라면, 뒤로가기 한 번 자동 실행
  if (sessionStorage.getItem("snsSaved") === "true") {
    sessionStorage.removeItem("snsSaved");
    history.replaceState(null, "", location.href); // 히스토리 정리
    history.back(); // 자동으로 my.html로 돌아감
  }
});

// -------------------- sns 갯수 가져오기 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "mySNS";
  const snsData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

  const snsRow = [...document.querySelectorAll(".edit-list")].find(el => {
    return el.querySelector(".edit-name")?.textContent.trim() === "내 SNS 링크";
  });

  if (sessionStorage.getItem("snsSaved") === "true") {
    sessionStorage.removeItem("snsSaved");
    location.reload();
  }

  if (snsRow) {
    const detailEl = snsRow.querySelector(".edit-detail");
    const filledCount = Object.values(snsData).filter(v => v && v.trim().length > 0).length;

    let detailDiv = detailEl;
    if (!detailDiv) {
      detailDiv = document.createElement("div");
      detailDiv.className = "edit-detail";
      snsRow.insertBefore(detailDiv, snsRow.querySelector(".more-img"));
    }

    detailDiv.textContent = `${filledCount}개`;
  }

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) location.reload();
  });

});

// -------------------- user.JSON 불러오기 --------------------
document.addEventListener("DOMContentLoaded", async () => {
  const tabs = document.querySelectorAll(".follow-tab");
  const listContainer = document.querySelector(".follower-lists");

  let userData = {};

  // -------------------- URL 파라미터 확인 --------------------
  const params = new URLSearchParams(window.location.search);
  const initialTab = params.get('tab') === 'following' ? 'followings' : 'followers';

  // -------------------- JSON 불러오기 --------------------
  try {
    const res = await fetch("./data/user.json");
    userData = await res.json();
  } catch (err) {
    console.error("❌ user.json 불러오기 실패:", err);
    return;
  }

  // -------------------- 초기 탭 활성화 --------------------
  tabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.type === initialTab);
  });

  // -------------------- 초기 리스트 렌더링 --------------------
  renderList(initialTab);

  // -------------------- 탭 클릭 이벤트 --------------------
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const type = tab.dataset.type;
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderList(type);
    });
  });

  // -------------------- 리스트 렌더링 함수 --------------------
  function renderList(type) {
    const data = userData[type] || [];
    listContainer.innerHTML = "";

    data.slice(0, 15).forEach(user => {
      const listItem = document.createElement("div");
      listItem.className = "follower-list";
      listItem.innerHTML = `
        <div class="follower-list-img">
          <img src="${user["user-img"]}" alt="${user["user-name"]}">
        </div>
        <div class="follower-content-user">
          <div class="follower-content-name">${user["user-name"]}</div>
          <div class="follower-content-msg">${user["user-msg"] || ''}</div>
        </div>
        <div class="${type === "followers" ? "follower-list-unfollow" : "follower-list-follow"}">
          ${type === "followers" ? "소식끊기" : "소식받기"}
        </div>
      `;

      // 프로필 클릭
      listItem.addEventListener("click", (e) => {
        if (
          e.target.classList.contains("follower-list-follow") ||
          e.target.classList.contains("follower-list-unfollow")
        ) return;
        window.open(`https://m.10000recipe.com/profile/recipe.html?uid=${user["user-seq"]}`, "_self");
      });

      listContainer.appendChild(listItem);
    });
  }

// -------------------- 팔로우 / 소식끊기 버튼 + 토스트 --------------------
document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("follower-list-follow") ||
    e.target.classList.contains("follower-list-unfollow")
  ) {
    e.stopPropagation(); // 부모 클릭 방지

    const listItem = e.target.closest(".follower-list");
    const userName = listItem.querySelector(".follower-content-name").textContent;

    const toast = document.getElementById("toast");

    if (e.target.classList.contains("follower-list-follow")) {
      e.target.classList.remove("follower-list-follow");
      e.target.classList.add("follower-list-unfollow");
      e.target.textContent = "소식끊기";

      showToast(`${userName}님의 소식을 알려드릴께요!`);
    } else if (e.target.classList.contains("follower-list-unfollow")) {
      e.target.classList.remove("follower-list-unfollow");
      e.target.classList.add("follower-list-follow");
      e.target.textContent = "소식받기";

      showToast(`${userName}님 팔로우를 취소했어요.`);
    }
  }
});
});

// -------------------- 차단회원 관리 전체 코드 --------------------
document.addEventListener("DOMContentLoaded", async () => {
  const listContainer = document.querySelector(".block-lists");
  const STORAGE_KEY = "blockedUsers";
  let userData = {};
  let blockedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

  // -------------------- JSON 불러오기 --------------------
  try {
    const res = await fetch("./data/user.json");
    userData = await res.json();
  } catch (err) {
    console.error("❌ user.json 불러오기 실패:", err);
    listContainer.innerHTML = "<p>차단회원 목록을 불러오지 못했습니다.</p>";
    return;
  }

  // -------------------- 차단회원 리스트 렌더링 --------------------
  function renderBlockList() {
    const data = userData.blockuser || [];
    listContainer.innerHTML = "";

    if (data.length === 0) {
      listContainer.innerHTML = "<p>차단회원이 없습니다.</p>";
      return;
    }

    data.forEach(user => {
      const userSeq = user["user-seq"];
      // 기본값: 차단 상태로 초기화
      if (!(userSeq in blockedState)) blockedState[userSeq] = true;

      const listItem = document.createElement("div");
      listItem.className = "block-list";
      listItem.dataset.userSeq = userSeq;
      listItem.innerHTML = `
        <div class="block-list-img">
          <img src="${user["user-img"]}" alt="${user["user-name"]}">
        </div>
        <div class="block-content-user">
          <div class="block-content-name">${user["user-name"]}</div>
        </div>
        <div class="${blockedState[userSeq] ? "block-list-unfollow" : "block-list-follow"}">
          ${blockedState[userSeq] ? "차단해제" : "차단하기"}
        </div>
      `;
      listContainer.appendChild(listItem);
    });

    // 로컬스토리지에 초기 상태 저장
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blockedState));
  }

  // -------------------- 토스트 표시 --------------------
  function showToast(msg) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
  }

  // -------------------- 차단/차단해제 버튼 클릭 이벤트 --------------------
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("block-list-follow") || e.target.classList.contains("block-list-unfollow")) {
      e.stopPropagation();

      const listItem = e.target.closest(".block-list");
      const userSeq = listItem.dataset.userSeq;
      const userName = listItem.querySelector(".block-content-name").textContent;

      if (e.target.classList.contains("block-list-follow")) {
        e.target.classList.replace("block-list-follow", "block-list-unfollow");
        e.target.textContent = "차단해제";
        blockedState[userSeq] = true;
        showToast(`${userName}님을 차단했습니다.`);
      } else {
        e.target.classList.replace("block-list-unfollow", "block-list-follow");
        e.target.textContent = "차단하기";
        blockedState[userSeq] = false;
        showToast(`${userName}님 차단을 해제했습니다.`);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(blockedState));
    }
  });

  // -------------------- 초기 렌더링 --------------------
  renderBlockList();
});

// -------------------- 로그아웃 다이얼로그 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.querySelector(".out-name:nth-child(1)");
  const dialog = document.querySelector(".member-dialog-overlay");
  const cancelBtn = dialog.querySelector(".member-dialog-cancel");
  const confirmBtn = dialog.querySelector(".member-dialog-delete");

  const toast = document.getElementById("toast");

  if (!logoutBtn || !dialog) return;

  logoutBtn.addEventListener("click", () => {
    dialog.style.display = "flex";
    dialog.querySelector(".member-dialog-desc").textContent = "정말 로그아웃 하시겠습니까?";
  });

  cancelBtn.addEventListener("click", () => {
    dialog.style.display = "none";
  });

  confirmBtn.addEventListener("click", () => {
    localStorage.clear();
    sessionStorage.clear();

    dialog.style.display = "none";

    if (toast) {
      toast.textContent = "로그아웃 되었습니다.";
      toast.classList.add("show");

      setTimeout(() => {
        toast.classList.remove("show");
        window.location.href = "index.html";
      }, 500);
    } else {
      window.location.href = "index.html";
    }
  });
});