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

  editOverlay.addEventListener("click", e => { if (e.target === editOverlay) closeEditSheet(); });

  document.querySelectorAll(".folder-option-edit").forEach(btn => {
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
    document.querySelector(".folder-select-overlay"),
    document.querySelector(".recipe-dialog-overlay"), // 추가
  ].filter(Boolean);

  overlays.forEach(overlay => {
    overlay.addEventListener("closeOverlay", () => {
      const sheet = overlay.querySelector(".folder-add, .folder-edit, .folder-select, .recipe-dialog-box");
      if (sheet) sheet.classList.remove("show");
      overlay.style.display = "none";
    });

    const observer = new MutationObserver(() => {
      const style = overlay.style.display;
      const isVisible = style === "flex" || style === "block";
      if (isVisible && !overlay.dataset.historyAdded) {
        history.pushState({ overlay: true }, "");
        overlay.dataset.historyAdded = "true";
      } else if (!isVisible) {
        delete overlay.dataset.historyAdded;
      }
    });

    observer.observe(overlay, { attributes: true, attributeFilter: ["style"] });
  });

  window.addEventListener("popstate", (e) => {
    const openOverlays = overlays.filter(o => o.style.display === "flex" || o.style.display === "block");
    if (openOverlays.length > 0) {
      e.preventDefault?.();
      const topOverlay = openOverlays[openOverlays.length - 1];
      topOverlay.dispatchEvent(new Event("closeOverlay"));
      history.pushState({}, "");
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
