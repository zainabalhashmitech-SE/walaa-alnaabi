

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".focus-gallery");

  if (!gallery) return;

  const galleryItems = [
    { src: "images/projects/pic_1.webp", category: "details", title: "خطوط صامتة", description: "تفاصيل تمر سريعًا، لكن الصورة تمنحها وقتًا أطول.", meta: "تفاصيل معمارية · عُمان" },
    { src: "images/projects/pic_3.webp", category: "products", title: "حضور المنتج", description: "حين يصبح اللون والضوء جزءًا من شخصية المنتج.", meta: "تصوير منتجات · 2026" },
    { src: "images/projects/pic_4.webp", category: "products", title: "لون وهوية", description: "تكوين بسيط يترك التفاصيل تتحدث.", meta: "تصوير منتجات · 2026" },
    { src: "images/projects/pic_5.webp", category: "products", title: "من الطبيعة", description: "المنتج داخل البيئة التي تكمل حكايته.", meta: "تصوير منتجات · 2026" },
    { src: "images/projects/pic_6.webp", category: "products", title: "ملمس وتفاصيل", description: "لقطة قريبة تُظهر المادة واللون بوضوح.", meta: "تصوير منتجات · 2026" },
    { src: "images/projects/pic_7.webp", category: "details", title: "منارة المكان", description: "لون يقود العين إلى ذاكرة المكان.", meta: "أماكن وتفاصيل · عُمان" },
    { src: "images/projects/pic_11.webp", category: "details", title: "ظل وتكوين", description: "حين يصنع الظل صورة أخرى داخل المشهد.", meta: "تصوير تجريدي · 2026" },
    { src: "images/projects/pic_12.webp", category: "details", title: "إيقاع معماري", description: "تكرار الخطوط يحول المبنى إلى إيقاع بصري.", meta: "تصوير معماري · 2026" },
    { src: "images/projects/pic_14.webp", category: "portraits", title: "نظرة", description: "بورتريه يترك للعين أن تقول ما لا يقوله النص.", meta: "بورتريه فني · 2026" },
    { src: "images/projects/pic_15.webp", category: "portraits", title: "بين اللون والملامح", description: "لون هادئ وملامح تحافظ على حضورها.", meta: "بورتريه فني · 2026" },
    { src: "images/projects/pic_16.webp", category: "portraits", title: "هدوء أخضر", description: "علاقة ناعمة بين اللون والضوء والتعبير.", meta: "بورتريه فني · 2026" },
    { src: "images/projects/pic_18.webp", category: "details", title: "هوية وطن", description: "تفصيل بسيط يحمل مكانًا كاملًا في داخله.", meta: "هوية عُمانية · 2026" },
    { src: "images/projects/pic_19.webp", category: "portraits", title: "حضور", description: "لقطة طبيعية توازن بين الشخصية والمكان.", meta: "بورتريه · 2026" },
    { src: "images/projects/pic_20.webp", category: "portraits", title: "ما بين اللحظات", description: "أصدق الصور قد تحدث قبل الاستعداد للكاميرا.", meta: "بورتريه · 2026" },
    { src: "images/projects/pic_21.webp", category: "events", title: "معًا إلى البداية", description: "إطار واحد يجمع نهاية مرحلة وبداية أخرى.", meta: "تخرج ومناسبات · 2026" },
    { src: "images/projects/pic_22.webp", category: "details", title: "تفاصيل المشهد", description: "ما يبدو عابرًا قد يصبح مركز الحكاية.", meta: "تفاصيل يومية · 2026" }
  ];

  const categoryNames = {
    portraits: "وجوه",
    products: "منتجات",
    events: "مناسبات",
    details: "تفاصيل"
  };

  const stage = gallery.querySelector(".focus-gallery__stage");
  const openButton = gallery.querySelector(".focus-gallery__open");
  const mainImage = gallery.querySelector(".focus-gallery__image");
  const title = gallery.querySelector(".focus-gallery__art-title");
  const description = gallery.querySelector(".focus-gallery__description");
  const category = gallery.querySelector(".focus-gallery__category");
  const meta = gallery.querySelector(".focus-gallery__meta");
  const counter = gallery.querySelector(".focus-gallery__counter");
  const progress = gallery.querySelector(".focus-gallery__progress-value");
  const thumbnails = gallery.querySelector(".focus-gallery__thumbs");
  const previousButton = gallery.querySelector(".focus-gallery__previous");
  const nextButton = gallery.querySelector(".focus-gallery__next");
  const filterButtons = [...gallery.querySelectorAll("[data-gallery-filter]")];
  const lightbox = gallery.querySelector(".focus-lightbox");
  const lightboxImage = gallery.querySelector(".focus-lightbox__image");
  const lightboxCounter = gallery.querySelector(".focus-lightbox__counter");
  const lightboxClose = gallery.querySelector(".focus-lightbox__close");
  const lightboxPrevious = gallery.querySelector(".focus-lightbox__previous");
  const lightboxNext = gallery.querySelector(".focus-lightbox__next");

  if (!stage || !mainImage || !thumbnails || !lightbox) return;

  let activeFilter = "all";
  let visibleItems = [...galleryItems];
  let currentIndex = 0;
  let changeTimer;
  let touchStartX = 0;
  let suppressOpen = false;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const twoDigits = (number) => String(number).padStart(2, "0");

  function currentItem() {
    return visibleItems[currentIndex];
  }

  function updateActiveThumbnail() {
    const buttons = [...thumbnails.querySelectorAll(".focus-gallery__thumb")];

    buttons.forEach((button, index) => {
      const isActive = index === currentIndex;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-current", isActive ? "true" : "false");
    });

   const activeButton = buttons[currentIndex];

if (activeButton) {
  const thumbnailPosition =
    activeButton.offsetLeft -
    thumbnails.clientWidth / 2 +
    activeButton.clientWidth / 2;

  thumbnails.scrollTo({
    left: thumbnailPosition,
    behavior: reducedMotion ? "auto" : "smooth"
  });
}
  }

  function updateLightbox() {
    if (!lightbox.open) return;

    const item = currentItem();
    lightboxImage.src = item.src;
    lightboxImage.alt = item.title;
    lightboxCounter.textContent = `${twoDigits(currentIndex + 1)} / ${twoDigits(visibleItems.length)}`;
  }

  function paintCurrentItem() {
    const item = currentItem();

    mainImage.src = item.src;
    mainImage.alt = `${item.title} — ${item.meta}`;
    title.textContent = item.title;
    description.textContent = item.description;
    category.textContent = categoryNames[item.category];
    meta.textContent = item.meta;
    counter.textContent = `${twoDigits(currentIndex + 1)} / ${twoDigits(visibleItems.length)}`;
    progress.style.width = `${((currentIndex + 1) / visibleItems.length) * 100}%`;

    const revealImage = () => stage.classList.remove("is-changing");
    mainImage.addEventListener("load", revealImage, { once: true });
    mainImage.addEventListener("error", revealImage, { once: true });

    if (mainImage.complete) requestAnimationFrame(revealImage);

    updateActiveThumbnail();
    updateLightbox();
  }

  function updateGallery(immediate = false) {
    window.clearTimeout(changeTimer);
    stage.classList.add("is-changing");

    if (immediate || reducedMotion) {
      paintCurrentItem();
      return;
    }

    changeTimer = window.setTimeout(paintCurrentItem, 160);
  }

  function renderThumbnails() {
    const fragment = document.createDocumentFragment();
    thumbnails.innerHTML = "";

    visibleItems.forEach((item, index) => {
      const button = document.createElement("button");
      const image = document.createElement("img");

      button.type = "button";
      button.className = "focus-gallery__thumb";
      button.setAttribute("aria-label", `عرض صورة ${item.title}`);
      button.dataset.index = String(index);

      image.src = item.src;
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";

      button.append(image);
      button.addEventListener("click", () => {
        currentIndex = index;
        updateGallery();
      });

      fragment.append(button);
    });

    thumbnails.append(fragment);
  }

  function move(step) {
    currentIndex = (currentIndex + step + visibleItems.length) % visibleItems.length;
    updateGallery();
  }

  function setFilter(filter) {
    activeFilter = filter;
    visibleItems = activeFilter === "all"
      ? [...galleryItems]
      : galleryItems.filter((item) => item.category === activeFilter);

    currentIndex = 0;

    filterButtons.forEach((button) => {
      const isActive = button.dataset.galleryFilter === activeFilter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    renderThumbnails();
    updateGallery();
  }

  function openLightbox() {
    if (suppressOpen) return;
    updateLightbox();
    lightbox.showModal();
    document.body.classList.add("lightbox-open");
    updateLightbox();
  }

  previousButton?.addEventListener("click", () => move(-1));
  nextButton?.addEventListener("click", () => move(1));
  lightboxPrevious?.addEventListener("click", () => move(-1));
  lightboxNext?.addEventListener("click", () => move(1));
  openButton?.addEventListener("click", openLightbox);
  lightboxClose?.addEventListener("click", () => lightbox.close());

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => setFilter(button.dataset.galleryFilter));
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  lightbox.addEventListener("close", () => {
    document.body.classList.remove("lightbox-open");
  });

  gallery.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") move(1);
    if (event.key === "ArrowRight") move(-1);
  });

  stage.addEventListener("pointerdown", (event) => {
    touchStartX = event.clientX;
  });

  stage.addEventListener("pointerup", (event) => {
    const distance = event.clientX - touchStartX;
    if (Math.abs(distance) < 50) return;

    suppressOpen = true;
    move(distance < 0 ? 1 : -1);
    window.setTimeout(() => {
      suppressOpen = false;
    }, 300);
  });

  renderThumbnails();
  updateGallery(true);
});
