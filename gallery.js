let isDragging = false;
let startPosition = 0;
let currentTranslate = 0;
let currentPosition = 0;
let prevTranslate = 0;
let slideIndex = 0;

const slider = document.getElementById("slider");
const slideWidth = slider.clientWidth / 10;

slider.addEventListener("mousedown", handleDragStart);
slider.addEventListener("touchstart", handleDragStart);
slider.addEventListener("mousemove", handleDrag);
slider.addEventListener("touchmove", handleDrag);
slider.addEventListener("mouseup", handleDragEnd);
slider.addEventListener("touchend", handleDragEnd);
slider.addEventListener("mouseleave", handleDragEnd);


// 슬라이드를 왼쪽으로 이동하는 함수
function slideLeft() {  // 부호 이후의 값을 더 작게 할 수록 더욱 왼쪽으로 밀림 (사진 증가시 줄이기)
  if (slider && slideIndex > -4) { // slider 변수가 존재하고 slideIndex를 체크
    slideIndex--;
    currentTranslate = -slideWidth * slideIndex;
    startPosition = currentTranslate;
    prevTranslate = currentTranslate;

    updateSliderPosition();
  }
}

// 슬라이드를 오른쪽으로 이동하는 함수
function slideRight() {
  const numSlides = slider.children.length;
  if (slider && slideIndex < numSlides - 4) { // slider 변수가 존재하고 slideIndex를 체크
    slideIndex++;
    currentTranslate = -slideWidth * slideIndex;
    startPosition = currentTranslate;
    prevTranslate = currentTranslate;

    updateSliderPosition();
  }
}

// 좌측 컨트롤러 클릭 시 슬라이드 이동
document.querySelector('.slider-control-left').addEventListener('click', slideLeft);

// 우측 컨트롤러 클릭 시 슬라이드 이동
document.querySelector('.slider-control-right').addEventListener('click', slideRight);



function handleDragStart(event) {
  event.preventDefault();

  if (event.type === "touchstart") {
    startPosition = event.touches[0].clientX;
  } else {
    startPosition = event.clientX;
  }

  isDragging = true;
}

function handleDrag(event) {
  if (!isDragging) return;

  if (event.type === "touchmove") {
    currentPosition = event.touches[0].clientX;
  } else {
    currentPosition = event.clientX;
  }

  currentTranslate = prevTranslate + currentPosition - startPosition;
  updateSliderPosition();
}

function handleDragEnd() {
  isDragging = false;

  startPosition = currentTranslate;
  prevTranslate = currentTranslate;

  // 슬라이더 위치 갱신
  updateSliderPosition();
}


function updateSliderPosition() {
  slider.style.transform = `translateX(${currentTranslate}px)`;
}

// 터치 이벤트를 처리하기 위한 함수 추가
function handleTouchStart(event) {
  handleDragStart(event);
}

function handleTouchMove(event) {
  handleDrag(event);
}

function handleTouchEnd(event) {
  handleDragEnd(event);
}

slider.addEventListener("touchstart", handleTouchStart);
slider.addEventListener("touchmove", handleTouchMove);
slider.addEventListener("touchend", handleTouchEnd);

// 터치 이벤트




function showLightbox(imgSrc) {
  const lightboxContainer = document.querySelector(".lightbox-container");
  const lightboxImg = document.querySelector(".lightbox-img");
  lightboxImg.src = imgSrc;
  lightboxContainer.classList.add("show");
}

function hideLightbox() {
  const lightboxContainer = document.querySelector(".lightbox-container");
  lightboxContainer.classList.remove("show");
}

const slideImages = document.querySelectorAll(".slide img");

slideImages.forEach((image, index) => {
  image.addEventListener("mouseenter", () => {
    if (image.parentNode.classList.contains("vertical-line")) {
      return;
    }
    image.style.opacity = "0.7";
  });

  image.addEventListener("mouseleave", () => {
    if (image.parentNode.classList.contains("vertical-line")) {
      return;
    }
    image.style.opacity = "1";
  });

  const lazyImage = document.createElement("img");
  lazyImage.classList.add("lazy");
  lazyImage.dataset.src = image.src;
  image.parentNode.replaceChild(lazyImage, image);

  // 클릭 이벤트 핸들러 추가
  const handleClick = () => {
    const imgSrc = lazyImage.dataset.src;
    showLightbox(imgSrc);
  };

  lazyImage.addEventListener("click", handleClick);
  lazyImage.addEventListener("touchstart", handleClick);
});

function lazyLoadImages() {
  const lazyImages = document.querySelectorAll(".lazy");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;

        img.src = src;
        img.classList.remove("lazy");

        imageObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach((lazyImage) => {
    imageObserver.observe(lazyImage);
  });
}

// 페이지 로드 시 기본 사진 인덱스 설정 및 이미지 로딩
window.addEventListener("DOMContentLoaded", () => {
  slideIndex = -4;    // 최초 슬라이드 시작점 (사진 개수에 따라 다름)
  currentTranslate = -slideWidth * slideIndex;
  updateSliderPosition();
  lazyLoadImages();
});

setInterval(updateSliderPosition, 10);