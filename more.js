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
      const folderName = btn.closest(".folder-list-option")?.querySelector(".folder-list-option-txt")?.textContent || "이 폴더";
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
      const folderNameElem = btn.closest(".folder-list-option").querySelector(".folder-list-option-txt");
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
