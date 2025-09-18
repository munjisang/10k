// ===========================
// 토스트 클릭 이벤트
// ===========================
const galleryIcon = document.querySelector(".gallery-icon");
const toast = document.getElementById("toast");

galleryIcon.addEventListener("click", () => {
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
});

// ===========================
// 배너 자동롤링 + 스와이프
// ===========================
const bannerWrapper = document.querySelector('.banner-wrapper');
const slides = document.querySelectorAll('.banner-slide');
const currentNav = document.querySelector('.banner-navigation .current');
const totalNav = document.querySelector('.banner-navigation .total');

let currentIndex = 0;
const totalSlides = slides.length;
totalNav.textContent = totalSlides;

// 자동 롤링 (3초)
setInterval(() => {
    currentIndex = (currentIndex + 1) % totalSlides;
    bannerWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    currentNav.textContent = currentIndex + 1;
}, 3000);

// 좌우 스와이프 (터치 이벤트)
let startX = 0;
let isDragging = false;

bannerWrapper.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    isDragging = true;
});

bannerWrapper.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const moveX = e.touches[0].clientX - startX;
    bannerWrapper.style.transform = `translateX(${ -currentIndex * 100 + moveX / bannerWrapper.offsetWidth * 100 }%)`;
});

bannerWrapper.addEventListener('touchend', e => {
    isDragging = false;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    if (diff > 50) { // 오른쪽 스와이프
        currentIndex = currentIndex > 0 ? currentIndex - 1 : 0;
    } else if (diff < -50) { // 왼쪽 스와이프
        currentIndex = currentIndex < totalSlides -1 ? currentIndex + 1 : totalSlides -1;
    }
    bannerWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    currentNav.textContent = currentIndex + 1;
});


// 중간 배너 랜덤 이미지
const middleBanner = document.getElementById('middleBanner');
const banners = ['/img/middle_banner_1.png', '/img/middle_banner_2.png'];

// 랜덤으로 하나 선택
const randomIndex = Math.floor(Math.random() * banners.length);
middleBanner.src = banners[randomIndex];


// JS: 커스텀 드롭다운 동작
const customSelects = document.querySelectorAll(".custom-select");

customSelects.forEach(select => {
  const selected = select.querySelector(".selected");
  const optionsContainer = select.querySelector(".options");
  const optionsList = optionsContainer.querySelectorAll("li");
  const chevronIcon = select.querySelector(".chevron-icon");

  selected.addEventListener("click", () => {
    const isOpen = select.classList.toggle("open"); // open 클래스 토글
    optionsContainer.style.display = isOpen ? "block" : "none";
  });

  optionsList.forEach(option => {
    option.addEventListener("click", () => {
      selected.textContent = option.dataset.value;
      select.classList.remove("open"); // 선택 시 close
      optionsContainer.style.display = "none";
    });
  });

  // 외부 클릭 시 닫기
  document.addEventListener("click", (e) => {
    if (!select.contains(e.target)) {
      select.classList.remove("open");
      optionsContainer.style.display = "none";
    }
  });
});
