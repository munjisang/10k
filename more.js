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