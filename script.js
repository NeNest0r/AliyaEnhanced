const toggle = document.querySelector(".menu-toggle");
const panel = document.querySelector(".menu-panel");
const contacts = document.querySelector(".contacts");

// ----- BURGER MENU: обновлённое поведение -----
// закрыть меню (вынесено в функцию для повторного использования)
function closeMenu() {
  panel.classList.remove("open");
  toggle.classList.remove("open");
}

// клик по кнопке — открываем/закрываем, предотвращаем всплытие,
// чтобы глобальный обработчик клика не закрыл меню сразу
toggle.addEventListener("click", (e) => {
  e.stopPropagation();
  panel.classList.toggle("open");
  toggle.classList.toggle("open");
});

// если клик внутри панели — не закрываем (останавливаем всплытие)
panel.addEventListener("click", (e) => {
  e.stopPropagation();
});

// закрыть меню при клике / таче в любом другом месте страницы
function outsideMenuHandler(e) {
  // если меню закрыто — ничего не делаем
  if (!panel.classList.contains("open")) return;

  // если клик/тач произошёл внутри .menu-container — не закрываем
  if (e.target.closest(".menu-container")) return;

  closeMenu();
}

document.addEventListener("click", outsideMenuHandler);
document.addEventListener("touchstart", outsideMenuHandler);

// закрыть меню по Esc
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && panel.classList.contains("open")) {
    closeMenu();
  }
});
// ----- /BURGER MENU -----

document.querySelectorAll(".menu-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const href = link.getAttribute("href");
    const target = document.querySelector(href);

    // Закрываем меню при выборе пункта
    closeMenu();

    if (href === "#contacts") {
      contacts.classList.add("visible");
      return;
    }

    const targetPosition = target.getBoundingClientRect().top + window.scrollY;
    const offset =
      targetPosition - (window.innerHeight / 2 - target.offsetHeight / 2);

    window.scrollTo({ top: offset, behavior: "smooth" });
  });
});

// Панель убирается скроллом
window.addEventListener("scroll", () => {
  contacts.classList.remove("visible");
});

// Панель убирается кликом (для contacts)
document.addEventListener("click", (e) => {
  if (
    contacts.classList.contains("visible") &&
    !contacts.contains(e.target) &&
    !e.target.closest(".menu-link[href='#contacts']")
  ) {
    contacts.classList.remove("visible");
  }
});

// ПЛЕЕР ДЛЯ МУЗЫКИ
const musicContainer = document.querySelector(".music-container");
const musicBtn = musicContainer.querySelector(".music-btn");
const musicPlayer = musicContainer.querySelector(".music-player");
const audio = musicPlayer.querySelector("audio");
const slider = musicPlayer.querySelector(".music-slider");

let isPlaying = false;

musicBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (!isPlaying) {
    musicPlayer.classList.add("active");
    audio.play();
    isPlaying = true;
  } else {
    musicPlayer.classList.remove("active");
    audio.pause();
    isPlaying = false;
  }
});

musicPlayer.addEventListener("mousedown", (e) => e.stopPropagation());
musicPlayer.addEventListener("mouseup", (e) => e.stopPropagation());
musicPlayer.addEventListener("click", (e) => e.stopPropagation());

audio.addEventListener("timeupdate", () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  slider.value = progress || 0;
});

slider.addEventListener("input", (e) => {
  e.stopPropagation();
  e.preventDefault();
  audio.currentTime = (slider.value / 100) * audio.duration;
});

audio.addEventListener("ended", () => {
  musicPlayer.classList.remove("active");
  isPlaying = false;
});

// ФОТО ГАЛЕРЕЯ
const photoBtn = document.querySelector(".photo-btn");
const photoGallery = document.querySelector(".photo-gallery");
const galleryImages = document.querySelector(".gallery-images");
const closeGallery = document.querySelector(".close-gallery");
const prevBtn = document.querySelector(".gallery-prev");
const nextBtn = document.querySelector(".gallery-next");

let currentIndex = 0;
const imgs = Array.from(galleryImages.querySelectorAll("img"));
const totalImages = imgs.length;

let isTransitioning = false;

function showImage(index) {
  if (isTransitioning) return;
  isTransitioning = true;

  if (index < 0) index = totalImages - 1;
  if (index >= totalImages) index = 0;
  currentIndex = index;

  galleryImages.style.transition =
    "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)";
  galleryImages.style.transform = `translateX(-${index * 100}%)`;

  setTimeout(() => {
    isTransitioning = false;
  }, 300);
}

function lockScroll() {
  document.body.style.overflow = "hidden";
  document.body.style.touchAction = "none";
}

function unlockScroll() {
  document.body.style.overflow = "";
  document.body.style.touchAction = "";
}

photoBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  photoGallery.classList.toggle("active");
  const isActive = photoGallery.classList.contains("active");
  photoGallery.setAttribute("aria-hidden", isActive ? "false" : "true");

  const menuContainer = document.querySelector(".menu-container");

  if (isActive) {
    showImage(currentIndex);
    lockScroll();
    if (menuContainer) menuContainer.style.display = "none";
  } else {
    unlockScroll();
    if (menuContainer) menuContainer.style.display = "";
  }
});

closeGallery.addEventListener("click", (e) => {
  e.stopPropagation();
  photoGallery.classList.remove("active");
  photoGallery.setAttribute("aria-hidden", "true");
  unlockScroll();
  document.querySelector(".menu-container").style.display = "";
});

// Кнопки вперед назад
prevBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  showImage(currentIndex - 1);
});
nextBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  showImage(currentIndex + 1);
});

// Клик по фону закрывает
photoGallery.addEventListener("click", (e) => {
  if (e.target === photoGallery) {
    photoGallery.classList.remove("active");
    photoGallery.setAttribute("aria-hidden", "true");
    unlockScroll();
    document.querySelector(".menu-container").style.display = "";
  }
});

// Свайп для мобилок
let startX = 0;
let endX = 0;
let isSwiping = false;
const swipeThreshold = 80;

photoGallery.addEventListener("touchmove", (e) => e.preventDefault(), {
  passive: false,
});

galleryImages.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  endX = startX;
  isSwiping = true;
  galleryImages.style.transition = "none";
});

galleryImages.addEventListener("touchmove", (e) => {
  if (!isSwiping) return;
  endX = e.touches[0].clientX;
  const deltaX = endX - startX;

  const maxOffset = (totalImages - 1) * 100;
  let offset = currentIndex * 100 - (deltaX / window.innerWidth) * 100;
  if (offset < 0) offset = 0;
  if (offset > maxOffset) offset = maxOffset;

  galleryImages.style.transform = `translateX(-${offset}%)`;
});

galleryImages.addEventListener("touchend", () => {
  if (!isSwiping) return;
  isSwiping = false;

  const deltaX = endX - startX;
  galleryImages.style.transition =
    "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)";

  if (Math.abs(deltaX) > swipeThreshold) {
    if (deltaX > 0 && currentIndex > 0) {
      showImage(currentIndex - 1);
    } else if (deltaX < 0 && currentIndex < totalImages - 1) {
      showImage(currentIndex + 1);
    } else {
      showImage(currentIndex);
    }
  } else {
    showImage(currentIndex);
  }

  startX = 0;
  endX = 0;
});

// === ВИДЕО ГАЛЕРЕЯ (фикс телепорта и скролла) ===
const videoBtn = document.querySelector(".video-btn");
const videoGallery = document.querySelector(".video-gallery");
const videoItems = document.querySelector(".video-items");
const closeVideoGallery = document.querySelector(".close-video-gallery");
const videoPrev = document.querySelector(".video-prev");
const videoNext = document.querySelector(".video-next");
const videos = Array.from(videoItems.querySelectorAll("video"));

let currentVideoIndex = 0;
let savedScrollY = 0; // сохраняем позицию страницы

// helper: показать видео по индексу
function showVideo(index) {
  if (index < 0) index = videos.length - 1;
  if (index >= videos.length) index = 0;
  currentVideoIndex = index;

  videoItems.style.transform = `translateX(-${index * 100}%)`;

  videos.forEach((v, i) => {
    if (i === index) {
      v.play().catch(() => {}); // игнор ошибок autoplay
    } else {
      v.pause();
      v.currentTime = 0;
    }
  });
}

// === открыть галерею ===
videoBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  savedScrollY = window.scrollY; // сохраняем позицию перед фиксацией

  // фиксируем body, чтобы страница не двигалась
  document.body.style.position = "fixed";
  document.body.style.top = `-${savedScrollY}px`;
  document.body.style.width = "100%";
  document.body.style.overflow = "hidden";

  videoGallery.classList.add("active");
  videoGallery.setAttribute("aria-hidden", "false");

  document.querySelector(".menu-container").style.display = "none";
  showVideo(currentVideoIndex);
});

// === закрыть галерею ===
closeVideoGallery.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  videos.forEach((v) => v.pause());
  if (document.activeElement && document.activeElement.tagName === "VIDEO") {
    document.activeElement.blur();
  }

  videoGallery.classList.remove("active");
  videoGallery.setAttribute("aria-hidden", "true");
  document.querySelector(".menu-container").style.display = "";

  // возвращаем прокрутку и позицию
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.overflow = "";
  window.scrollTo({ top: savedScrollY, behavior: "instant" });
});

// === кнопки листания ===
videoPrev.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  showVideo(currentVideoIndex - 1);
});

videoNext.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  showVideo(currentVideoIndex + 1);
});

// === клик по фону — закрыть ===
videoGallery.addEventListener("click", (e) => {
  if (e.target === videoGallery) {
    e.preventDefault();
    e.stopPropagation();

    videos.forEach((v) => v.pause());
    videoGallery.classList.remove("active");
    videoGallery.setAttribute("aria-hidden", "true");
    document.querySelector(".menu-container").style.display = "";

    // восстанавливаем прокрутку
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.overflow = "";
    window.scrollTo({ top: savedScrollY, behavior: "instant" });
  }
});
