// ✅ recipe-area 데이터 관리
export const recipeAreas = [
  {
    id: "10K_01",
    title: "만개 PICK! 따라하고싶은 만개셰프 레시피!",
    description: "저장해두고 따라하고싶은 만개셰프들의 추천 레시피"
  },
  {
    id: "trending",
    title: "NOW TRENDING",
    description: "지금 뜨고있는 레시피"
  },
  {
    id: "10K_02",
    title: "더울수록 뜨겁게! 이열치열 한 그릇",
    description: "더위도 잊게 만드는 뜨끈한 한입"
  },
  {
    id: "movie",
    title: "동영상 레시피",
    description: "동영상을 보고 쉽게 따라해보세요"
  }  
];

// ✅ index.html용 : 각 영역에 텍스트 적용
export function renderRecipeAreas() {
  document.querySelectorAll('.recipe-area').forEach(area => {
    const id = area.dataset.id;
    const data = recipeAreas.find(item => item.id === id);
    if (!data) return;

    const titleEl = area.querySelector('.recipe-area-title');
    const descEl = area.querySelector('.recipe-area-subtitle');

    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.description;
  });
}

// ✅ more_item.html용 : 선택된 id 데이터 렌더링
export function renderMorePage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const data = recipeAreas.find(item => item.id === id);
  if (!data) return;

  const titleEl = document.querySelector('.recipe-more-title');
  const descEl = document.querySelector('.recipe-more-subtitle');

  if (titleEl) titleEl.textContent = data.title;
  if (descEl) descEl.textContent = data.description;
}
