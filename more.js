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
  const backBtn = document.querySelector(".leding-icons");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (document.referrer) window.history.back();
      else window.location.href = "index.html";
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

// -------------------- 토스트 기본 엘리먼트 생성 --------------------
let toast = document.getElementById("toast");
if (!toast) {
  toast = document.createElement("div");
  toast.id = "toast";
  document.body.appendChild(toast);
}

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
  // --- DOM 엘리먼트 안전하게 선택 ---
  const selectWrapper = document.querySelector(".cate-select-wrapper");
  const subCateItemsContainer = document.querySelector(".sub-cate-items");
  const listContainer = document.querySelector(".list-items");

  // 셀렉트가 존재하지 않으면 실패하지 않도록 조기 리턴(필요하다면 later로 초기화 가능)
  if (!selectWrapper) {
    console.warn("cate-select-wrapper가 없습니다. cate-custom-select 동작 불가.");
  }

  // 셀렉트 내부 엘리먼트 (안전하게 접근)
  const customSelect = selectWrapper ? selectWrapper.querySelector(".cate-custom-select") : null;
  const selected = customSelect ? customSelect.querySelector(".selected") : null;
  const optionsContainer = customSelect ? customSelect.querySelector(".cate-options") : null;
  const chevron = customSelect ? customSelect.querySelector(".cate-chevron-icon") : null;

  // list 및 서브카테고리 처리에 필요한 변수들
  let categories = [];
  let recipes = [];
  let currentPage = 0;
  const itemsPerPage = 300;

  // URL 파라미터에서 category / sub 값 읽기
  const urlParams = new URLSearchParams(window.location.search);
  const selectedCategoryNameFromURL = urlParams.get("category");
  const selectedSubNameFromURL = urlParams.get("sub");

  // --- 셀렉트 UI 유틸: 열기/닫기 함수 ---
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

  // --- 레시피 렌더링 (기본: 필터 없이 전체 목록을 보여줌) ---
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

  // --- 카테고리 로드 및 select 옵션 생성 ---
  try {
    const res = await fetch("./data/category.json");
    categories = await res.json();
    if (!Array.isArray(categories) || categories.length === 0) {
      console.warn("category.json이 비어있거나 배열이 아님");
    } else {
      // 안전하게 optionsContainer 초기화
      if (optionsContainer) {
        optionsContainer.innerHTML = "";
        optionsContainer.style.display = "none"; // 초기 숨김
      }

      // 옵션 목록 생성
      categories.forEach(cat => {
        if (!optionsContainer) return;
        const li = document.createElement("li");
        li.dataset.value = cat.category_name;
        li.textContent = cat.category_name;
        li.style.cursor = "pointer";

        li.addEventListener("click", (e) => {
          e.stopPropagation(); // 클릭 버블 방지
          if (selected) selected.textContent = li.dataset.value;
          closeSelect();

          const selectedCategory = categories.find(c => c.category_name === li.dataset.value);
          if (selectedCategory) {
            renderSubCategories(selectedCategory.sub, null); // URL 기반 active는 렌더Sub에서 처리
          }
        });

        optionsContainer.appendChild(li);
      });

      // URL에 category가 있으면 해당 값으로 초기 선택, 없으면 첫 항목
      const initialCategory = categories.find(c => c.category_name === selectedCategoryNameFromURL) || categories[0];
      if (selected) selected.textContent = (initialCategory && initialCategory.category_name) || "";
      if (initialCategory) renderSubCategories(initialCategory.sub, selectedSubNameFromURL);
    }
  } catch (err) {
    console.error("❌ category.json 로드 실패:", err);
  }

  // --- selected 클릭(셀렉트 열기/닫기) 처리 ---
  if (selected) {
    // 클릭 시 select 토글, 이벤트 버블 차단
    selected.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleSelect();
    });
  }

  // chevron 아이콘도 클릭 허용
  if (chevron) {
    chevron.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleSelect();
    });
  }

  // 문서 클릭 시 셀렉트 닫기
  document.addEventListener("click", (e) => {
    // 단, customSelect 내 클릭은 닫지 않음 (stopPropagation 사용으로 대부분 차단됨)
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

      // active 처리: URL에 지정된 sub가 있으면 그걸 우선, 없으면 첫번째
      if (activeSubName && sub.sub_category_name === activeSubName) {
        div.classList.add("active");
      } else if (!activeSubName && idx === 0) {
        div.classList.add("active");
      }

      div.addEventListener("click", (e) => {
        e.preventDefault();
        // 활성화 토글
        subCateItemsContainer.querySelectorAll(".sub-cate-item").forEach(el => el.classList.remove("active"));
        div.classList.add("active");

        // list 새로고침 (요구하신 대로 필터 없이 전체 목록 재출력)
        listContainer && (listContainer.innerHTML = "");
        currentPage = 0;
        renderItems(true);
      });

      subCateItemsContainer.appendChild(div);
    });

    // 만약 active가 아예 없으면 첫 번째에 active 부여
    if (!subCateItemsContainer.querySelector(".sub-cate-item.active") && subCateItemsContainer.firstChild) {
      subCateItemsContainer.firstChild.classList.add("active");
    }
  }

  // --- 레시피 데이터 로드 ---
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


