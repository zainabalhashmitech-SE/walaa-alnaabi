if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}


/* ==================================================
   Header Scroll Effect
================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const siteHeader = document.querySelector(".site-header");
  const navigationLinks = [...document.querySelectorAll(".nav-link")];
  const pageSections = navigationLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const artistAboutSection = document.querySelector(".artist-about");
  const photoStage = document.querySelector(".artist-about__photo-stage");
  const photoCard = document.querySelector(".artist-about__photo-paper");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  const updateHeader = () => {
    siteHeader?.classList.toggle("scrolled", window.scrollY > 20);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (artistAboutSection) {
    if ("IntersectionObserver" in window) {
      const artistAboutObserver = new IntersectionObserver(
        (entries, observer) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            artistAboutSection.classList.add("is-visible");
            observer.disconnect();
          }
        },
        { threshold: 0.18 }
      );

      artistAboutObserver.observe(artistAboutSection);
    } else {
      artistAboutSection.classList.add("is-visible");
    }
  }

  /* Subtle pointer tilt for the single photograph card. */
  if (photoStage && photoCard && finePointer.matches && !reducedMotion.matches) {
    photoStage.addEventListener("pointermove", (event) => {
      const bounds = photoStage.getBoundingClientRect();
      const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;

      photoCard.style.setProperty("--card-rotate-x", `${relativeY * -5}deg`);
      photoCard.style.setProperty("--card-rotate-y", `${relativeX * 7}deg`);
    });

    photoStage.addEventListener("pointerleave", () => {
      photoCard.style.removeProperty("--card-rotate-x");
      photoCard.style.removeProperty("--card-rotate-y");
    });
  }

  /* Keep the header link synchronized with the visible section. */
  if ("IntersectionObserver" in window && pageSections.length) {
    const navigationObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleEntry) return;

        navigationLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${visibleEntry.target.id}`;
          link.classList.toggle("active", isActive);

          if (isActive) link.setAttribute("aria-current", "page");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-35% 0px -50%", threshold: [0, 0.25, 0.6] }
    );

    pageSections.forEach((section) => navigationObserver.observe(section));
  }
});
