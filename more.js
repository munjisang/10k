// -------------------- 레시피 더보기 (무한 스크롤) --------------------
document.addEventListener("DOMContentLoaded", () => {
  const listContainer = document.querySelector(".list-items");
  const itemsPerPage = 20; // 한 번에 로드할 개수
  let currentPage = 0;
  let recipes = [];

  // 아이템 렌더링
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

  // 스크롤 감지 → 끝까지 내려가면 다음 20개 로드
  function handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      // 다음 페이지 데이터가 있으면 추가 로드
      if (currentPage * itemsPerPage < recipes.length) {
        renderItems();
      }
    }
  }

  // 데이터 로드
  fetch("./data/recipe.json")
    .then(res => res.json())
    .then(data => {
      recipes = data.recipes.slice(0, 45); // 45개만 사용
      renderItems(); // 초기 20개 로드
      window.addEventListener("scroll", handleScroll);
    })
    .catch(err => console.error("레시피 데이터 로드 실패:", err));
});

// -------------------- header 이전버튼 이동 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.querySelector(".leding-icons");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (document.referrer) {
        // 이전 방문 페이지가 있으면 이동
        window.history.back();
      } else {
        // 이전 페이지가 없으면 index.html로 이동
        window.location.href = "index.html";
      }
    });
  }
});

// -------------------- 닫기버튼 이동 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const folderEditBtn = document.querySelector(".page-close");
  if (folderEditBtn) {
    folderEditBtn.addEventListener("click", () => {
      window.location.href = "scrap.html";
    });
  }
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

  cancelBtn.addEventListener("click", () => {
    dialog.style.display = "none";
  });

  deleteBtn.addEventListener("click", () => {
    dialog.style.display = "none";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  });

  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.style.display = "none";
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

    const toast = document.getElementById("toast");
    if (toast) {
      toast.classList.remove("show");
      void toast.offsetWidth;
      toast.textContent = `"${folderName}" 폴더가 추가되었습니다.`;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2500);
    }
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

// -------------------- 토스트 기본 엘리먼트 생성 --------------------
let toast = document.getElementById("toast");
if (!toast) {
  toast = document.createElement("div");
  toast.id = "toast";
  document.body.appendChild(toast);
}

// -------------------- 폴더명 수정 바텀시트 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const editOverlay = document.querySelector(".folder-edit-overlay");
  const editSheet = document.querySelector(".folder-edit");
  const editInput = document.querySelector(".folder-edit-input");
  const cancelBtn = document.querySelector(".folder-edit-cancel");
  const saveBtn = document.querySelector(".folder-edit-save");

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

    toast.textContent = "폴더명이 수정되었습니다.";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  });

  editOverlay.addEventListener("click", (e) => {
    if (e.target === editOverlay) closeEditSheet();
  });

  document.querySelectorAll(".folder-option-edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      const folderNameElem = btn.closest(".folder-editlist-option").querySelector(".folder-editlist-option-txt");
      openEditSheet(folderNameElem);
    });
  });
});

// -------------------- 안드로이드 뒤로가기 오버레이 제어 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const overlays = [
    document.querySelector(".folder-add-overlay"),
    document.querySelector(".folder-edit-overlay"),
    document.querySelector(".dialog-overlay"),
  ].filter(Boolean);

  overlays.forEach(overlay => {
    overlay.addEventListener("closeOverlay", () => {
      if (overlay.classList.contains("folder-add-overlay")) {
        const bottomSheet = overlay.querySelector(".folder-add");
        bottomSheet.classList.remove("show");
        setTimeout(() => overlay.style.display = "none", 300);
      } else if (overlay.classList.contains("folder-edit-overlay")) {
        const editSheet = overlay.querySelector(".folder-edit");
        editSheet.classList.remove("show");
        setTimeout(() => overlay.style.display = "none", 300);
      } else if (overlay.classList.contains("dialog-overlay")) {
        overlay.style.display = "none";
      }
    });

    const observer = new MutationObserver(() => {
      const style = overlay.style.display;
      if (style === "flex" || style === "block") {
        history.pushState({ overlay: true }, "");
      }
    });
    observer.observe(overlay, { attributes: true, attributeFilter: ["style"] });
  });

  window.addEventListener("popstate", (e) => {
    const anyOpen = overlays.find(o => o.style.display === "flex" || o.style.display === "block");
    if (anyOpen) {
      e.preventDefault?.();
      anyOpen.dispatchEvent(new Event("closeOverlay"));
      history.pushState({}, "");
    }
  });
});

// -------------------- 스크랩 폴더 활성화 전환 + list-items 갱신 --------------------
document.addEventListener("DOMContentLoaded", () => {
  const scrapArea = document.querySelector(".scrap-area") || document.querySelector(".scrap-edit-area");
  const listItems = scrapArea?.querySelector(".list-items") || null;
  const nodata = document.querySelector(".scrap-area-nodata") || document.querySelector(".scrap-edit-area-nodata");

  let recipeList = [];

  // ✅ Fisher-Yates 셔플 함수
  function shuffleArray(array, count) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, count);
  }

  // 레시피 데이터 로드
  fetch('./data/recipe.json')
    .then(res => res.json())
    .then(data => {
      recipeList = data.recipes || [];
      initFolderList(".folder-list");
      initFolderList(".scrap-edit-folder");

      // 초기 폴더 클릭
      const initial =
        document.querySelector(".folder-active") ||
        document.querySelector(".folder-list > div") ||
        document.querySelector(".scrap-edit-folder > div");
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

        // 1️⃣ 리스트 초기화
        listItems.innerHTML = "";

        // 2️⃣ 폴더 상태 초기화
        folders.forEach(f => {
          f.classList.remove("folder-active");
          f.classList.add("folder-nonactive");
          const name = f.querySelector("span");
          const countDiv = f.querySelector("div");
          if (name) name.className = "folder-nonactive-name";
          if (countDiv) countDiv.className = "folder-nonactive-count";
        });

        // 3️⃣ 현재 폴더 활성화
        folder.classList.remove("folder-nonactive");
        folder.classList.add("folder-active");
        const name = folder.querySelector("span");
        const countDiv = folder.querySelector("div");
        if (name) name.className = "folder-active-name";
        if (countDiv) countDiv.className = "folder-active-count";

        // 4️⃣ count 읽기
        let count = 0;
        if (countDiv?.textContent) {
          const match = countDiv.textContent.match(/\d+/);
          count = match ? parseInt(match[0], 10) : 0;
        }

        // 5️⃣ 리스트 갱신
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

          // 6️⃣ 레시피 선택 이벤트
          let selected = false;
          const overlay = item.querySelector(".overlay");
          const checkbox = item.querySelector(".checkbox");

          item.addEventListener("click", (e) => {
            e.stopPropagation();
            selected = !selected;
            overlay.style.backgroundColor = selected ? 'var(--DIM-TERTIARY)' : 'var(--DIM-WHITE)';
            checkbox.src = selected ? './img/check_active.png' : './img/check_default.png';

            const selectedCount = document.querySelectorAll('.list-item .checkbox[src*="check_active.png"]').length;
            updateEditMenuState(selectedCount);
          });

          listItems.appendChild(item);
        });

        // 7️⃣ 폴더 리스트 중앙 정렬
        const folderRect = folder.getBoundingClientRect();
        const listRect = folderList.getBoundingClientRect();
        const center = listRect.width / 4 - folderRect.width / 2;
        const targetScroll = folderRect.left + folderList.scrollLeft - listRect.left - center;
        folderList.scrollTo({ left: targetScroll, behavior: "smooth" });

        // 8️⃣ 스크롤 이동 (헤더 + 폴더 높이 고려)
        const headerHeight = document.querySelector(".sub-header")?.offsetHeight || 0;
        const folderHeight = folderList.offsetHeight || 0;
        const scrapAreaTop = scrapArea.getBoundingClientRect().top + window.scrollY;
        const scrollToPos = scrapAreaTop - headerHeight - folderHeight;
        window.scrollTo({ top: scrollToPos, behavior: "smooth" });
      });
    });
  }
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
